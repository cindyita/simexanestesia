import { useEffect } from "react";

function AppFavicon({ src }) {
    useEffect(() => {
        const link = document.querySelector("link[rel~='icon']");
        if (link) {
            link.href = src;
        } else {
            const newLink = document.createElement('link');
            newLink.rel = 'icon';
            newLink.href = src;
            document.head.appendChild(newLink);
        }
    }, [src]);

    return null;
}

export default AppFavicon;
