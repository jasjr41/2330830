import { logger } from "./logger";
import { Notification, NotificationsResponse, FetchNotificationsParams } from "./types";

const API_BASE = "http://4.224.186.213/evaluation-service/notifications";

// For the evaluation, we use a mock token since auth is pre-authorised per requirements
const AUTH_TOKEN = "evaluation-token";

export async function fetchNotifications(
  params: FetchNotificationsParams = {}
): Promise<Notification[]> {
  const context = "fetchNotifications";
  const url = new URL(API_BASE);

  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.limit) url.searchParams.set("limit", String(params.limit));
  if (params.notification_type) url.searchParams.set("notification_type", params.notification_type);

  logger.info(context, "Fetching notifications from API", { url: url.toString(), params });

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      // Use no-store to always get fresh data
      cache: "no-store",
    });

    if (!response.ok) {
      logger.error(context, "API responded with non-200 status", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: NotificationsResponse = await response.json();
    logger.info(context, "Successfully fetched notifications", {
      count: data.notifications?.length ?? 0,
    });

    return data.notifications ?? [];
  } catch (err) {
    logger.error(context, "Failed to fetch notifications", { error: String(err) });
    throw err;
  }
}

// Priority scoring for Stage 6 logic reused in Stage 7
const TYPE_WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export function getPriorityScore(notification: Notification): number {
  const weight = TYPE_WEIGHT[notification.Type] ?? 0;
  const ts = new Date(notification.Timestamp).getTime() / 1000;
  return weight * 1e10 + ts;
}

export function getTopNPriority(notifications: Notification[], n: number): Notification[] {
  logger.debug("getTopNPriority", `Computing top ${n} priority notifications`, {
    total: notifications.length,
  });
  const sorted = [...notifications].sort(
    (a, b) => getPriorityScore(b) - getPriorityScore(a)
  );
  return sorted.slice(0, n);
}
