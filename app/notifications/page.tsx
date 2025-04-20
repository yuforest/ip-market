import { AlertCircle, Bell, CheckCircle, DollarSign, Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export default function NotificationsPage() {
  // Sample notification data
  const notifications = [
    {
      id: "1",
      type: "purchase",
      title: "Purchase Complete",
      message: "Your purchase of Anime Avatars has been completed.",
      date: "August 10, 2023",
      read: false,
      projectId: "3",
    },
    {
      id: "2",
      type: "listing",
      title: "Listing Complete",
      message: "CryptoKitties Japan has been successfully listed.",
      date: "May 15, 2023",
      read: true,
      projectId: "1",
    },
    {
      id: "3",
      type: "report",
      title: "Report Generated",
      message: "Valuation report for Samurai Warriors has been generated.",
      date: "June 21, 2023",
      read: false,
      projectId: "2",
    },
    {
      id: "4",
      type: "offer",
      title: "Purchase Offer",
      message: "You have received a purchase offer for CryptoKitties Japan.",
      date: "July 5, 2023",
      read: true,
      projectId: "1",
    },
  ];

  // Function to get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case "listing":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "report":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "offer":
        return <DollarSign className="h-5 w-5 text-rose-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Latest updates about your projects
            </p>
          </div>
          <Button variant="outline">Mark All as Read</Button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.read ? "bg-white" : "bg-gray-50"}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {!notification.read && (
                        <Badge variant="default" className="bg-rose-500">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {notification.date}
                    </p>
                  </div>
                  <div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/projects/${notification.projectId}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
