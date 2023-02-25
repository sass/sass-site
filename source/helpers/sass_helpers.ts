function getImplStatus(status) {
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

module.exports = { getImplStatus };
