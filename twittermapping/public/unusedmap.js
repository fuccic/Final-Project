// var app = angular.module("myapp", []);

//     app.directive("globe", function() {
//         	var places = [
// 		{
// 		    location: {
// 		      latitude: -34.42507,
// 		      longitude: 180.89315
// 		    }
// 		  },
// 		  {
// 		    location: {
// 		      latitude: -32.92669,
// 		      longitude: -360
// 		    }
// 		  }
// 		]
//         return {
//             restrict   : 'E',
//             scope      : {
//                 data: '=?'
//             },
//             template: 
//             '<div class="globe-wrapper">' +
//                 '<div class="globe"></div>' +
//                 '<div class="info"></div>' +
//             '</div>',
//             link: link
//         };
        
//         function link(scope, element, attrs) {
//             var width = 500, height = width, 
//                 projection, path,
//                 svg, features, graticule,
//                 mapJson = 'https://gist.githubusercontent.com/GordyD/49654901b07cb764c34f/raw/27eff6687f677c984a11f25977adaa4b9332a2a9/countries-and-states.json',
//                 states, stateSet, countries, countrySet, zoom;
            
//             projection = d3.geo.orthographic()
//                 .translate([width / 2, height / 2])
//                 .scale(250)
//                 .clipAngle(90)
//                 .precision(0.1)
//                 .rotate([0, -30]);
            
//             path = d3.geo.path()
//                 .projection(projection);
            
//             svg = d3.select(element[0]).select('.globe')
//                 .append('svg')
//                 .attr('width', width)
//                 .attr('height', height)
//                 .attr('viewBox', '0, 0, ' + width + ', ' + height);
           
//             features = svg.append('g');
            
//             features.append('path')
//                 .datum({type: 'Sphere'})
//                 .attr('class', 'background')
//                 .attr('d', path);
            
//             graticule = d3.geo.graticule();

//             features.append('path')
//               .datum(graticule)
//               .attr('class', 'graticule')
//               .attr('d', path);
            
//             zoom = d3.geo.zoom()
//               .projection(projection)
//               .scaleExtent([projection.scale() * 0.7, projection.scale() * 8])
//               .on('zoom.redraw', function(){
//                 d3.event.sourceEvent.preventDefault();
//                 svg.selectAll('path').attr('d',path);
//               });
            
//             d3.json(mapJson, function(error, world) {
//                 states = topojson.feature(world, world.objects.states).features;
//                 countries = topojson.feature(world, world.objects.countries).features;
                
//                 stateSet = drawFeatureSet('state', states);
//                 countrySet = drawFeatureSet('country', countries);
                
//                 d3.selectAll('path').call(zoom);
//             });
            
//             function drawFeatureSet(className, featureSet) {
//                 var set  = features.selectAll('.' + className)
//                 .data(featureSet)
//                 .enter()
//                 .append('g')
//                 .attr('class', className)
//                 .attr('data-name', function(d) {
//                     return d.properties.name;
//                 })
//                 .attr('data-id', function(d) {
//                     return d.id;
//                 });
                
//                 set.append('path')
//                 .attr('class', 'land')
//                 .attr('d', path);
                
//                 set.append('path')
//                 .attr('class', 'overlay')
//                 .attr('d', path)
//                 .attr('style', function(d) {
//                     if (scope.data[d.id]) {
//                         return 'fill-opacity: ' + (scope.data[d.id]/100);
//                     }
//                 })
//                 .on('click', function(d) {
//                     var val = (scope.data[d.id]) ? scope.data[d.id] : 0;
//                     d3.select(element[0]).select('.info').html(d.properties.name + ': ' + val);
                    
//                     rotateToFocusOn(d);
//                 }); 
                
//                 return set;
//             }
            
//             function rotateToFocusOn(x) {
//                 var coords = d3.geo.centroid(x);
//                 console.log(x);
//                 coords[0] = -coords[0];
//                 coords[1] = -coords[1];
                
//                 d3.transition()
//                 .duration(800)
//                 .tween('rotate', function() {
//                     var r = d3.interpolate(projection.rotate(), coords);
//                     return function(t) {
//                         projection.rotate(r(t));
//                         svg.selectAll('path').attr('d', path);
//                     };
//                 })
//                 .transition();
//             }
			

			
//             function placeCircles(){

// 	            svg.selectAll(".pin")
// 				  .data(places)
// 				  .enter().append("circle", ".pin")
// 				  .attr("r", 5)
// 				  .attr("transform", function(d) {
// 				    return "translate(" + projection([
// 				      d.location.longitude,
// 				      d.location.latitude
// 				    ]) + ")";
// 				  });

// 			}
// 			placeCircles();

// 	    }
//     });


//     app.controller("ctrl1",function($scope, $log) {
//         $scope.data = {
//         };
//     });

//     app.run();