export function getRelativeTimeString(createdAt: string | null | undefined): string {
  if (!createdAt) return 'Posted recently';

  const now = new Date();
  const postedDate = new Date(createdAt);
  const diffInMs = Math.abs(now.getTime() - postedDate.getTime());

  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  // Less than 1 hour
  if (hours < 1) {
    if (minutes < 2) return 'Posted just now';
    return `Posted ${minutes} minutes ago`;
  }

  // Less than 24 hours
  if (hours < 24) {
    return `Posted ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  // Days + Remaining Hours formatting
  if (remainingHours > 0) {
    return `Posted ${days} ${days === 1 ? 'day' : 'days'} ${remainingHours} ${remainingHours === 1 ? 'hour' : 'hours'} ago`;
  }

  return `Posted ${days} ${days === 1 ? 'day' : 'days'} ago`;
}
