 var meny = Meny.create({
// The element that will be animated in from off screen
            menuElement: document.querySelector( '.meny' ),

        // The contents that gets pushed aside while Meny is active
            contentsElement: document.querySelector( '.contents' ),
        
        // The alignment of the menu (top/right/bottom/left)
            position: 'left',

        // The width of the menu (when using left/right position)
            width: 230,

        // The angle at which the contents will rotate to.
            angle: 85,

        // The mouse distance from menu position which can trigger menu to open.
            threshold: 55,

        // Width(in px) of the thin line you see on screen when menu is in closed position.
            overlap: 5,

        // The total time taken by menu animation.
            transitionDuration: '0.4s',

        // Transition style for menu animations
            transitionEasing: 'ease-in-out',

        // Use mouse movement to automatically open/close
            mouse: true,

        // Use touch swipe events to open/close
            touch: true,
            });
