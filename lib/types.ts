export type NotificationType = "Placement" | "Result" | "Event";

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
  isRead?: boolean;
}

export interface NotificationsResponse {
  notifications: Notification[];
}

export interface FetchNotificationsParams {
  page?: number;
  limit?: number;
  notification_type?: NotificationType | "";
}
