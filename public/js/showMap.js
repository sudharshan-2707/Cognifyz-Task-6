var map = tt.map({
  key: MAP_KEY,
  container: "mapDiv",
  center:[lng,lat],
  zoom:13
})

let marker = new tt.Marker({color:"crimson"}).setLngLat([lng,lat]).addTo(map)