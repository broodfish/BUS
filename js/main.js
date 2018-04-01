var points_list={};
points_list.list = [
  //{lat:xxx,lng:xxx}
];
var routepoint=[];
var mk = {};
mk.list=[];
function initMap() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 22.999136, lng: 120.218259 }
  });
  directionsDisplay.setMap(map);
  document.getElementById('save').addEventListener('click', function() {
          calculateAndDisplayRoute(directionsService, directionsDisplay);
        });
  map.addListener('click', function(e) {
    placeMarkerAndPanTo(e.latLng, map);
  });
}


//mk.list=[];
function placeMarkerAndPanTo(latLng, map) {
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
  map.panTo(latLng);
  var point = latLng;
  lat = latLng.lat();
  lng = latLng.lng();
  var text = lat+","+lng;
  points_list.list.push(
      {
        latlng:text,
        points:point,
      }
    );
  var myLatLng = new google.maps.LatLng({lat: lat, lng: lng});
  routepoint.push(myLatLng);
  console.log(routepoint);
  mk.list.push(marker);
  showlist();
}

//定義元素用的html模板，{{名稱}}代表要套入的地方
var item_html="<ul id={{id}} class='points'><div class='latlng'>{{latlng}}</div><div id={{del_id}} data-delid={{del_item_id}} class='del_btn'>X</div></ul>";

//刪除並重新產生清單中所有項目
function showlist(){
  $("#latlng").html("");
  //把每個項目做出來
  for(var i=0;i<points_list.list.length;i++){
    var item=points_list.list[i];
    var item_id="point_"+i;
    var del_item_id="del_"+i;
    
    //取代模板位置成資料replace(要取代的,取代成...)
    var current_item_html=
        item_html.replace("{{id}}",i+1)
                 .replace("{{latlng}}",item.latlng)
                 .replace("{{del_id}}",del_item_id)
                 .replace("{{del_item_id}}",i)

    ;
    $("#latlng").append(current_item_html);
    $("#"+del_item_id).click(
      function(){
        remove_item(parseInt($(this).attr("data-delid")));
      }
    );
  }
}
showlist();

function remove_item(id){
  mk.list[id].setMap(null);
  mk.list.splice(id,1);
  points_list.list.splice(id,1);
  showlist();
}

var output = [];
var outputlatlng = [];



function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  for (var i = 0; i < points_list.list.length; i++) {
      output.push(points_list.list[i].latlng);
      //outputlatlng.push(routepoint.list[i]);
  }
  for (var i = 0; i < routepoint.length; i++) {
      outputlatlng.push(routepoint[i]);
  }
  var waypts = [];
  for (var i = 1 ; i<outputlatlng.length-1;i++){
    waypts.push({
      location: outputlatlng[i],
      stopover: true
      });
  }
  directionsService.route({
    origin: outputlatlng[0],
    destination: outputlatlng[outputlatlng.length-1],
    waypoints: waypts,
    optimizeWaypoints: true,
    travelMode: 'DRIVING'
    },function(response, status) {
          if (status == 'OK') {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            var summaryPanel = document.getElementById('directions-panel');
            summaryPanel.innerHTML = '';
            // For each route, display summary information.
            /*for (var i = 0; i < route.legs.length; i++) {
              var routeSegment = i + 1;
              summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                  '</b><br>';
              summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
              summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
              summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
          }*/
          } else{
            window.alert('Directions request failed due to ' + status);
          }
  }
                          
);
  
}/*

  var waypts = {};
  waypts.list = [];
  for (var i = 1; i < outputlatlng.length-1; i++) {
    waypts.list.push({
      location: outputlatlng[i],
      stopover: true
      });
      
      }
  console.log(waypts.list);
 
  directionsService.route({
    origin: outputlatlng[0],
    destination: outputlatlng[outputlatlng.length-1],
    waypoints: waypts.list,
    optimizeWaypoints: true,
    travelMode: 'DRIVING'
    },function(response, status) {
          if (status == 'OK') {
            
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            var summaryPanel = document.getElementById('directions-panel');
            summaryPanel.innerHTML = '';
            // For each route, display summary information.
            for (var i = 0; i < route.legs.length; i++) {
              var routeSegment = i + 1;
              summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                  '</b><br>';
              summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
              summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
              summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
              
            
          } else {
            window.alert('Directions request failed due to ' + status);
          }
    
        });
      }*/