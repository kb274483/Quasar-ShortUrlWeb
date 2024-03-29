self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  const title = data.title || 'Schedule Notification';
  const options = {
    body: data.body || 'You have something to do',
    icon: '../public/icons/active.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});