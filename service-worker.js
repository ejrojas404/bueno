self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('alarms-cache').then((cache) => {
            return cache.addAll([
                'alarma.mp3',
                'index.html',
                'script.js',
                'styles.css' 
            ]);
        })
    );
});

self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: 'icon.png' // 
    };
    event.waitUntil(
        self.registration.showNotification('Alarma', options)
    );
});
