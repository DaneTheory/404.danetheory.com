var map = {
		$src: undefined,
		width: 0,
		$parent: undefined,
		$anchor: undefined,
		$info:undefined,
		gPoint: [],
		gMapOpts: {},
		gMap: undefined,
		initLoaded:false,
};

var preventMapHiding = false;

function whOverlay(bounds, image, map) {
	this.bounds_ = bounds;
	this.image_ = image;
	this.map_ = map;

	this.div_ = null;
	this.setMap(map);
}

function initMap(){

	map.$src = $('#popupMap');
	map.$link = $('#footer .location > a');
	map.width = map.$src.width();
	map.$parent = map.$src.parent();
	map.$info = map.$src.find('.info-block');

	map.gPoint = new google.maps.LatLng(htdtCoords[0],htdtCoords[1]);
	map.gMapOpts = {
		mapTypeControl: false,
		panControl: false,
		rotateControl: false,
		scaleControl: false,
		scrollwheel: false,
		styles: [
			// Водоёмы
			{
				featureType: 'water',
				elementType: 'geometry',
				stylers: [{
					color: '#4099ff'
				}]
			},{
				featureType: 'water',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#2b3b4e'
				}]
			},{
				featureType: 'water',
				elementType: 'labels.text.stroke',
				stylers: [{
					visibility: 'on'
				}]
			},
			// Шоссе
			{
				featureType: 'road',
				elementType: 'geometry.fill',
				stylers: [{
					color: '#333333'
				}]
			},{
				featureType: 'road',
				elementType: 'geometry.stroke',
				stylers: [{
					color: '#ffffff'
				}]
			},
			// Земля и здания
			{
				featureType: 'landscape',
				elementType: 'geometry.fill',
				stylers: [
					{hue: '#743815'},
					{saturation:70},
					{lightness:-35}
				]
			}, {
				featureType: 'landscape',
				elementType: 'geometry.stroke',
				stylers: [
					{color:'#8b4319'}
				]
			},

			{
				featureType: 'poi',
				elementType: 'geometry.fill',
				stylers: [
					{hue: '#743815'},
					{saturation:70},
					{lightness:-35}
				]
			}, {
				featureType: 'poi',
				elementType: 'geometry.stroke',
				stylers: [
					{color:'#8b4319'}
				]
			},
			// Текстовые метки домов
			{
				featureType: 'administrative',
				elementType: 'labels.text.stroke',
				stylers: [{
					visibility: 'on'
				}]
			},{
				featureType: 'administrative',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#222222'
				}]
			},

			{
				featureType: 'poi',
				elementType: 'labels.text.stroke',
				stylers: [{
					visibility:'on'
				}]
			},

			{
				featureType: 'road',
				elementType: 'labels.text.stroke',
				stylers: [{
					visibility:'on'
				}]
			},{
				featureType: 'road',
				elementType: 'labels.text.fill',
				stylers: [{
					color:'#222222'
				}]
			},
			// Метки ЖД, метро
			{
				featureType: 'transit',
				elementType: 'labels.text.stroke',
				stylers: [{
					visibility:'on'
				}]
			},{
				featureType: 'transit',
				elementType: 'labels.text.fill',
				stylers: [{
					color:'#000000'
				}]
			},
			// Парк
			{
				featureType: 'poi.park',
				elementType: 'geometry.fill',
				stylers: [{
					color: '#333333'
				}]
			}
		],
		zoom: 15,
		center: map.gPoint,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	whOverlay.prototype = new google.maps.OverlayView();

	var swBound = new google.maps.LatLng(32.7764749, -79.93105120000001);
	var neBound = new google.maps.LatLng(32.7764749, -79.93105120000001);
	map.whBounds = new google.maps.LatLngBounds(swBound, neBound);

	whOverlay.prototype.onAdd = function() {
		var div = document.createElement('div');
		div.className = 'map-building-stressed';
		div.style.border = 'none';
		div.style.borderWidth = '0px';
		div.style.position = 'absolute';

		var img = document.createElement('img');
		img.src = this.image_;
		img.style.width = '100%';
		img.style.height = '100%';
		div.appendChild(img);

		this.div_ = div;
		var panes = this.getPanes();
		panes.overlayImage.appendChild(this.div_);
	};

	whOverlay.prototype.draw = function() {
		var overlayProjection = this.getProjection();

		var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
		var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

		var div = this.div_;
		// ie8 hack
		ne.y = isNaN(ne.y) ? 0 : ne.y;
		sw.y = isNaN(ne.y) ? 0 : ne.y;

		div.style.left = sw.x + 'px';

		div.style.top = ne.y + 'px';
		div.style.width = (ne.x - sw.x) + 'px';
		div.style.height = (sw.y - ne.y) + 'px';
	};

	whOverlay.prototype.onRemove = function() {
		this.div_.parentNode.removeChild(this.div_);
	};

	whOverlay.prototype.hide = function() {
		if (this.div_) {
			this.div_.style.visibility = 'hidden';
		}
	};

	whOverlay.prototype.show = function() {
		if (this.div_) {
			this.div_.style.visibility = 'visible';
		}
	};

	whOverlay.prototype.toggle = function() {
		if (this.div_) {
			if (this.div_.style.visibility == 'hidden') {
				this.show();
			} else {
				this.hide();
			}
		}
	};

	whOverlay.prototype.toggleDOM = function() {
		if (this.getMap()){
			this.setMap(null);
		} else {
			this.setMap(this.map_);
		}
	};

	map.$link.on('click', function(event){
		locationLinkHover(event);
		return false;
	});

}

function repositionMap(){
	map.gMap.panTo(map.gPoint);
	// ie8 hack
	var h = !isNaN(window.innerHeight) ? window.innerHeight: document.documentElement.clientHeight;
	map.gMap.panBy(0, - h / 4);
}

function locationLinkHover(e){
	map.$src.fadeIn();

	if(window.para != undefined){
		para.stopParallax = true;
	}

	if(map.initLoaded)
		repositionMap();
	else{
		map.gMap = new google.maps.Map(document.getElementById('htdt-map'), map.gMapOpts);

		var marker = new google.maps.Marker({
			map: map.gMap,
			icon: mapMarkerSrc,
			draggable: false,
			position:map.gPoint,
			visible: true
		});

		google.maps.event.addDomListener(map.gMap, 'tilesloaded', function(){
			if(!map.initLoaded){
				var overlay = new whOverlay(map.whBounds, mapWHOverlayImg, map.gMap);
				repositionMap();
			}
			if(! map.$info.data('click-bound')){

				google.maps.event.addDomListener(marker, 'click', function(){
					map.$info.toggleClass('slid');
				});

				$('#popupMap').find('.toggler').on('click', function(){
					map.$info.toggleClass('slid');
					if(!!window.opera)
						this.style += "";
				});
				map.$info.data('click-bound', 1);
			}
			map.initLoaded = true;
		});
		google.maps.event.addDomListener(window, 'resize', function(){
			repositionMap();
		});
	}
}

function tryToHidePopupMap(e){

	if(iPadMode){

		if(e.target==map.$link[0] ||
		   map.$link.find($(e.target)).length>0){
			console.log('falseAlarm');
			return;
		}
		map.$src.fadeOut();
		// para.mouseWheelTarget.bind('mousewheel', onMouseWheel);
		if(window.para != undefined)
			para.stopParallax = false;
	}
	else{
		map.$src.fadeOut();
		if(window.para != undefined)
			para.stopParallax = false;
	}
}


$(function() {
	var $footer = $('#footer');
	if (tdLib.deviceDescription.type != tdLib.DEVICE_TYPES.desktop
		&& tdLib.deviceDescription.touchCapable){

		$footer.find('.languageSwitch .a').on('touchstart', function(args){
			$(this).toggleClass('hover');
		});

	}
	else{
		$footer.find('.languageSwitch .a').hover(function(args){
			var $this = $(this).addClass('hover');
		}, function(args){
			var $this = $(this).removeClass('hover');
		});
	}

	if (tdLib.debu){
		$('#box-list').remove();
	}
	else{
		initMap();
	}
	$footer.on('click', '.icon-close', tryToHidePopupMap);
});
