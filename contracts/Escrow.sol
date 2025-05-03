// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Escrow
 * @dev NFTコレクションのIP取引を管理するコントラクト
 */
contract Escrow is Ownable, ReentrancyGuard {
    // USDC トークンのインターフェース
    IERC20 public immutable usdcToken;

    // プラットフォーム手数料率（0.1%）
    uint256 public constant FEE_RATE = 10; // 0.10%
    uint256 public constant FEE_DENOMINATOR = 10000;

    // セール情報
    struct Sale {
        address collectionAddress; // NFTコレクションのアドレス
        uint256 price; // 販売価格（USDC）
        address seller; // 売り手アドレス
        SaleStatus status; // セールのステータス
    }

    // セールのステータス
    enum SaleStatus {
        Open,
        Canceled,
        Sold
    }

    // セールID => セール情報
    mapping(uint256 => Sale) private _sales;

    // 最新のセールID
    uint256 private _nextSaleId = 1;

    // イベント
    event SaleRegistered(
        uint256 indexed saleId,
        address indexed collectionAddress,
        address indexed seller,
        uint256 price
    );
    event SaleCanceled(uint256 indexed saleId);
    event SalePurchased(
        uint256 indexed saleId,
        address indexed buyer,
        uint256 price
    );
    event FeeDistributed(uint256 saleId, uint256 feeAmount);
    event OwnershipTransferred(
        address indexed collectionAddress,
        address indexed previousOwner,
        address indexed newOwner
    );
    event SalePriceUpdated(
        uint256 indexed saleId,
        uint256 oldPrice,
        uint256 newPrice
    );
    event SaleCancelled(uint256 indexed saleId);

    /**
     * @dev コンストラクタ
     * @param _usdcAddress USDCトークンのアドレス
     */
    constructor(address _usdcAddress) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcAddress);
    }

    /**
     * @dev セールを登録する
     * @param collectionAddress NFTコレクションのアドレス
     * @param price 販売価格（USDC）
     * @return saleId 発行されたセールID
     */
    function registerSale(
        address collectionAddress,
        uint256 price
    ) external returns (uint256) {
        require(collectionAddress != address(0), "Invalid collection address");
        require(price > 0, "Price must be greater than zero");

        // コレクションのオーナーが出品者と一致するか確認
        Ownable collection = Ownable(collectionAddress);
        require(
            collection.owner() == msg.sender,
            "Seller must be the owner of the collection"
        );

        uint256 saleId = _nextSaleId++;
        _sales[saleId] = Sale({
            collectionAddress: collectionAddress,
            price: price,
            seller: msg.sender,
            status: SaleStatus.Open
        });

        emit SaleRegistered(saleId, collectionAddress, msg.sender, price);

        return saleId;
    }

    /**
     * @dev セール情報を取得する
     * @param saleId セールID
     * @return collection コレクションアドレス
     * @return price 価格
     * @return seller 売り手アドレス
     * @return status セールのステータス
     */
    function getSale(
        uint256 saleId
    )
        external
        view
        returns (
            address collection,
            uint256 price,
            address seller,
            SaleStatus status
        )
    {
        Sale storage sale = _sales[saleId];
        require(sale.seller != address(0), "Sale does not exist");

        return (sale.collectionAddress, sale.price, sale.seller, sale.status);
    }

    /**
     * @dev セールを購入する（コレクションのオーナーシップ移転）
     * @param saleId 購入するセールID
     */
    function buy(uint256 saleId) external nonReentrant {
        Sale storage sale = _sales[saleId];
        require(sale.seller != address(0), "Sale does not exist");
        require(sale.status == SaleStatus.Open, "Sale is not open");
        require(msg.sender != sale.seller, "Seller cannot be buyer");

        // セールステータスを更新
        sale.status = SaleStatus.Sold;

        // 手数料計算
        uint256 feeAmount = (sale.price * FEE_RATE) / FEE_DENOMINATOR;
        uint256 sellerAmount = sale.price - feeAmount;

        // USDC送金処理
        require(
            usdcToken.transferFrom(msg.sender, address(this), sale.price),
            "USDC transfer failed"
        );
        require(
            usdcToken.transfer(sale.seller, sellerAmount),
            "Seller payment failed"
        );
        require(
            usdcToken.transfer(owner(), feeAmount),
            "Fee payment to platform failed"
        );

        // オーナーシップ移転
        Ownable collection = Ownable(sale.collectionAddress);
        address previousOwner = collection.owner();
        collection.transferOwnership(msg.sender);

        emit SalePurchased(saleId, msg.sender, sale.price);
        emit FeeDistributed(saleId, feeAmount);
        emit OwnershipTransferred(
            sale.collectionAddress,
            previousOwner,
            msg.sender
        );
    }

    /**
     * @dev セールの価格を更新する
     * @param saleId 更新するセールのID
     * @param newPrice 新しい価格（USDC）
     */
    function updateSalePrice(uint256 saleId, uint256 newPrice) external {
        require(saleId < _nextSaleId, "Sale does not exist");
        require(newPrice > 0, "Price must be greater than zero");

        Sale storage sale = _sales[saleId];
        require(sale.seller == msg.sender, "Only seller can update price");
        require(sale.status == SaleStatus.Open, "Sale must be open");

        uint256 oldPrice = sale.price;
        sale.price = newPrice;

        emit SalePriceUpdated(saleId, oldPrice, newPrice);
    }

    /**
     * @dev セールをキャンセルする
     * @param saleId キャンセルするセールのID
     */
    function cancelSale(uint256 saleId) external {
        require(saleId < _nextSaleId, "Sale does not exist");

        Sale storage sale = _sales[saleId];
        require(sale.seller == msg.sender, "Only seller can cancel sale");
        require(sale.status == SaleStatus.Open, "Sale must be open");

        sale.status = SaleStatus.Canceled;

        // コレクションの所有権を売り手に戻す
        Ownable collection = Ownable(sale.collectionAddress);
        address previousOwner = collection.owner(); // 現在はエスクローコントラクト
        collection.transferOwnership(sale.seller);

        emit SaleCanceled(saleId);
        emit OwnershipTransferred(
            sale.collectionAddress,
            previousOwner,
            sale.seller
        );
    }

    function getSaleId() external view returns (uint256) {
        return _nextSaleId;
    }
}
