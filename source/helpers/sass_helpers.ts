export function getImplStatus(status: string | boolean | null) {
  switch (status) {
    case null:
      return status;
    case true:
      return '✓';
    case false:
      return '✗';
    case 'partial':
      return 'partial';
    default:
      return `since ${status}`;
  }
}
