let MapDOM = document.querySelector("#map");
let BranchListDOM = document.querySelector(".dealer-locator-list .list");
let map,
	infoWindow,
	markers = [];
let locationsInput = locationsInput || [];
let google = google || {};
let mapOption = {
	gestureHandling: "cooperative",
	zoom: 12,
	styles: [
		{
			featureType: "administrative",
			elementType: "labels.text.fill",
			stylers: [
				{
					color: "#444444",
				},
			],
		},
		{
			featureType: "landscape",
			elementType: "all",
			stylers: [
				{
					color: "#f2f2f2",
				},
			],
		},
		{
			featureType: "poi",
			elementType: "all",
			stylers: [
				{
					visibility: "off",
				},
			],
		},
		{
			featureType: "road",
			elementType: "all",
			stylers: [
				{
					saturation: -100,
				},
				{
					lightness: 45,
				},
			],
		},
		{
			featureType: "road.highway",
			elementType: "all",
			stylers: [
				{
					visibility: "simplified",
				},
			],
		},
		{
			featureType: "road.arterial",
			elementType: "labels.icon",
			stylers: [
				{
					visibility: "off",
				},
			],
		},
		{
			featureType: "transit",
			elementType: "all",
			stylers: [
				{
					visibility: "off",
				},
			],
		},
		{
			featureType: "water",
			elementType: "all",
			stylers: [
				{
					color: "#0c6db5",
				},
				{
					visibility: "on",
				},
			],
		},
	],
};

const addMarkers = () => {
	markers = [];
	const bounds = new google.maps.LatLngBounds();
	locationsInput.forEach((location, index) => {
		let locationLatLng = new google.maps.LatLng(location.lat, location.lng);
		let marker = new google.maps.Marker({
			map: map,
			title: location.title,
			position: locationLatLng,
			icon: location.icon,
		});
		bounds.extend(marker.position);
		markers.push(marker);
		showInfoMarkerOnMap(marker, index);
	});

	map.fitBounds(bounds);
};

const showInfoMarkerOnMap = (marker, index) => {
	google.maps.event.addListener(marker, "click", function () {
		infoWindow.setContent(`
				<h3>${locationsInput[index].title}</h3>
				<p>${locationsInput[index].address}</p>
				<p>${locationsInput[index].phone}</p>
			`);
		infoWindow.open(map, marker);
		map.panTo(marker.getPosition());
		map.setZoom(12);
	});
	google.maps.event.addListener(map, "click", function () {
		infoWindow.close();
	});
};

const getLocationList = () => {
	if (BranchListDOM) {
		BranchListDOM.innerHTML = "";
		markers.forEach((marker, index) => {
			const newMarker = document.createElement("div");
			newMarker.classList.add("dealer-locator-item");
			newMarker.innerHTML = `
				<h3>${locationsInput[index].title}</h3>
				<p>${locationsInput[index].address}</p>
				<p>${locationsInput[index].phone}</p>
			`;
			newMarker.setAttribute("marker-id", `${index}`);
			newMarker.addEventListener("click", () => {
				const markerIndex = newMarker.getAttribute("marker-id");
				google.maps.event.trigger(markers[markerIndex], "click");
			});
			BranchListDOM.appendChild(newMarker);
		});
	}
};

const initialize = () => {
	infoWindow = new google.maps.InfoWindow();
	map = new google.maps.Map(MapDOM, mapOption);
	addMarkers();
	let listener = google.maps.event.addListener(map, "idle", () => {
		if (map.getZoom() > 12) {
			map.setZoom(12);
		}
		google.maps.event.removeListener(listener);
	});
	google.maps.event.addListener(map, "bounds_changed", getLocationList);
};

if (MapDOM) {
	google.maps.event.addDomListener(window, "load", initialize);
	if (BranchListDOM) {
		getLocationList();
	}
}
