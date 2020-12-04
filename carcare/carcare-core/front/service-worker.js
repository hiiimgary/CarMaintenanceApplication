importScripts('./ngsw-worker.js');

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('static-v1').then(cache => {
            cache.addAll([
                '/assets/static/offline-style.css',
                '/assets/static/offline.html',
            ])
        })
    );
})

self.addEventListener('fetch', event => {
    event.respontWith(
        caches.match(event.request).then(response => response || fetch(event.request)).catch(() => {
            if(event.request.mode == 'navigate'){
                return caches.match('/assets/static/offline.html');
            }
        })
    )
})

self.addEventListener('sync', (event) => {
    const tag = JSON.parse(event.tag);
        event.waitUntil(fetchAndSend(tag));
})

function fetchAndSend(tag) {
    let db;
    const request = indexedDB.open('sync-db');
    request.onerror = (event) => {
        console.log('Cannot use IndexDB');
    };
    request.onsuccess = (event) => {
        db = event.target.result;
        fetchData(db, tag);
    };
}

function fetchData(db, tag) {
    const transaction = db.transaction(tag.objectStore);
    const objectStore = transaction.objectStore(tag.objectStore);
    const request = objectStore.get(tag.key);
    request.onerror = (event) => {
        console.log(request);
    };
    request.onsuccess = (event) => {
        const jwtTran = db.transaction(['jwt-token']);
        const jwtoStore = jwtTran.objectStore('jwt-token');
        const jwtReq = jwtoStore.get('header');
        jwtReq.onsuccess = (e) => {
            sendData(JSON.stringify(request.result), tag, jwtReq.result, db);

        }
    };
}

function sendData(data, tag, token, db) {
    return fetch('/api/user/' + tag.path, {
        method: 'POST',
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: data,
    })
        .then((res) => {
            console.log(res);
            const transaction = db.transaction(tag.objectStore, 'readwrite');
            const objectStore = transaction.objectStore(tag.objectStore);
            objectStore.delete(tag.key);
            Promise.resolve(res);
            
            
        })
        .catch((err) => {
            console.log(err);
            Promise.reject();
            
            
        });
}

