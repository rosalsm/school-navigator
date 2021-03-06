var app = angular.module("schoolsApp", [
    'ngRoute',
    'SchoolsApp.directives',
    'SchoolsApp.geoDecoder',
    'SchoolsApp.services',
    'SchoolsApp.controllers'
]);

app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $routeProvider
        .when('/', {
            controller: 'schoolsMapCtrl',
            templateUrl: 'app/templates/map.html',
            reloadOnSearch: false
            })
        .when('/location/:latitude/:longitude/', {
            controller: 'schoolsMapCtrl',
            templateUrl: 'app/templates/map.html'
            })
        .when('/school/:school/', {
            controller: 'schoolsDetailCtrl',
            templateUrl: 'app/templates/details.html'
            })
        .when('/about', {
            templateUrl: 'app/templates/about.html'
            })
        .when('/navigating', {
            templateUrl: 'app/templates/navigating.html'
            })
        .when('/navigating/neighborhood', {
            templateUrl: 'app/templates/neighborhood.html'
            })
        .when('/navigating/charter', {
            templateUrl: 'app/templates/charter.html'
            })
        .when('/navigating/magnet', {
            templateUrl: 'app/templates/magnet.html'
            })
        .when('/schools', {
            templateUrl: 'app/templates/navigating.html'
            })
        .when('search', {
        })
}]);

angular.module('SchoolsApp.services', [])
    .service('Schools', ['$http', function($http) {
        var endpoint = location.search.indexOf('env') === -1? 'https://durhamschoolnavigator.org' : 'http://localhost:8001',
            url;

        this.get_schools = function(location) {
          url = endpoint + '/api/schools/';
          return $http({
              method: 'GET',
              url: url,
              params: {
                  longitude: location.lng,
                  latitude: location.lat
              }
          });
        };

        this.get = function(id) {
          url = endpoint + '/api/schools/detail/' + id + '/';
          return $http({ method: 'GET', url: url });
        };

        this.get_reflexions = function(id) {
            url = endpoint + '/api/schools/reflexions/' + id + '/';
            return $http({ method: 'GET', url: url });
        }
}]);

angular.module('SchoolsApp.geoDecoder', [])
    .service('Geodecoder', google.maps.Geocoder);


angular.module('SchoolsApp.controllers', ["leaflet-directive"])
    .controller('schoolsDetailCtrl', ['$scope', '$routeParams', 'Schools',
        function($scope, $params, Schools) {
            var mocked_school = {
                name: 'Sample School Elementary',
                school_type: 'Magnet School',
                grades: 'PK-5',
                enrollment: '346 students',
                theme: 'Language focus',

                mission_statement: 'We strive to educate students and to assist them in realizing their full potential as responsible, productive, contributing members of society',
                photo: 'http://durhamme.com/wp-content/uploads/2010/09/durham_maine_school2.jpg',
                points_of_pride: [
                    " We have the only spanish immersion program in Durham's public school system.",
                    "Principal McCowen has been with our school for 5 years and remains committed to our students' growth and development.",
                    "We have a very active PTA.  Families play a huge role in supporting our students and learning community."
                ],

                address: '1000 North Duke St.',
                phone_number: '919-705-555',
                website: 'sampleschooleleementary.org',
                year_opened: 1980,
                avg_class_size: 23,
                calendar_year: 'Regular',
                school_day: '8:00am - 3:30pm',
                uniform_required: 'No',

                services: {
                    transportation_provided: true,
                    extended_care_hours: '3:30pm - 5:30pm',
                    breakfast_provided: true,
                    lunch_provided: true
                },
                school_leadership: {
                    name: 'Teresa Allen',
                    years_of_service: 2013,
                    bio: "Teresa Allen began her educational career in the Charlotte-Mecklenberg School District in 2001 as a second grade teacher at Jefferson Elementary School. Ms. Allen spent six years teaching within the district as a second and third grade teacher at both Jefferson Elementary and Gill Hall Elementary before accepting his first principal position in the Orange County School District. Over the next four years, Ms. Allen served as an elementary building principal in both Orange County and Durham School Districts, respectively. In 2013, Ms. Allen returned to DPS as principal of Sample School Elementary. This year marks her second year as principal of SSE and eighth as an elementary building principal. Ms. Allen has received a Bachelor’s Degree in Biology from the Pennsylvania State University in 1999 and a Master’s Degree in Elementary Education in from the University of Chapel Hill in 2001. "
                },
                teacher_satisfaction: {
                    'Overall, my school is a good place to work and learn.': [68, 62],
                    'The school leadership consistently supports teachers': [81, 66],
                    'Teachers are allowed to focus on educating students with minimal interruptions': [75, 54]
                },
                survey: {
                  percent: 100,
                  year: "2014-15",
                  name: "North Carolina Teacher Conditions Survey",
                  link: "http://ncteachers.org/survey/404/results.html"
                },
                admission_policy: {
                    policy_type: "This school guarantees admission for children who live in the walk zone.  The remaining spots are filled through an open lottery.",
                    lottery_priorities: [
                      { name: "Walk zone",
                        desc: "(guaranteed admission)"},
                        { name: "Siblings of enrolled students"},
                        { name: "Children of staff"},
                        { name: "General applicant pool"}
                    ],
                    lottery_deadline: "February 1st ",
                    lottery_acceptance_rate: "38% of students who applied to the lottery in 2014-15 were accepted.",
                    learn_more: "http://dpsncapplication.com/site.php"
                },
                targeted_academics: [
                  { name: 'English Language Learner',
                    desc: "One bilingual teacher in each grade provides an hour of language training each day to our students identified as ELL.  In addition all school resources are available in Spanish and English."},
                  { name: 'Gifted Students',
                    desc: "Students identified as intellectually gifted receives services through the APEX Program."},
                  { name: 'Special Education',
                    desc: "We have a special education teacher and instrucional aide for each grade who provide push-in and pull-out services.  We also provide robust interventions for students who need extra support but do not have an IEP"}
                ],
                other_programs: [
                  { name: 'Math Science',
                    desc: 'STEM club, Abacus Math club'},
                  { name: 'Arts',
                    desc: 'drama club'},
                  { name: 'Sports',
                    desc: 'basketball, soccer, baseball for 4th and 5th graders'},
                  { name: 'Other',
                    desc: 'chess after-school club'}
                ],
                parent_involvement: {
                    pta: true,
                    learn_more: 'http://www.sampleschoolelementary.org/pta'
                },
                reflections: [
                    {
                        reflection: "I have two kids at SSE and have been very satisfied with their experience.  The teachers are committed to students' learning and both have become fluent in spanish as a result of their enrollment.  My only complaint is that I wish there were more extracurricular offerings.",
                        who: "Parent of 3rd grader (1/12/15)"
                    }
                ],
                reflection_link: "http://durhamschoolnavigator.com/reflections/404",
                report_card_link: "http://ncschoolreportcard.com/school/404"
            };
            angular.extend($scope, {
              defaults: {
              },
              center: {
                lat: 36, lng: -78.9, zoom: 12
              },
              tiles: {
                name: 'School Mapbox',
                url: 'https://{s}.tiles.mapbox.com/v4/vrocha.j3fib8g6/{z}/{x}/{y}.png32?access_token=pk.eyJ1IjoidnJvY2hhIiwiYSI6Ijc4VTRqNlkifQ.IAL1V6TtIekAMo2sP61J3Q',
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                type: 'xyz'
              },
              markers: { }
            });
            Schools.get($params.school).success(function(school) {
                $scope.school = school;
                $scope.center.lat = school.location.coordinates[1];
                $scope.center.lng = school.location.coordinates[0];
                $scope.markers = {};
                var schoolObj = {
                  lat: school.location.coordinates[1],
                  lng: school.location.coordinates[0],
                  id: school.id,
                  message: school.name,
                  icon: {
                    type: 'div',
                    iconSize: [50, 50],
                    iconAnchor: [25, 25],
                    popupAnchor:  [0, -10],
                    html: school.short_name,
                    className: "school_point " + school.level
                  }
                };
                $scope.markers.school = schoolObj;
                angular.extend($scope.school, mocked_school);
            });
        }
    ])
    .controller('schoolsMapCtrl', ['$scope', '$filter', '$routeParams', '$location', 'Geodecoder', 'Schools',
        function($scope, $filter, $params, $location, Geodecoder, Schools) {
          angular.extend($scope, {
            defaults: {
              maxZoom: 18,
              minZoom: 11,
              zoomControlPosition: 'bottomright'
            },
            eligibility: "assigned",
            toggleSelectSchool: function (school) {
              var selFunction = school.selected ? function(scl) { scl.selected = false; } : function(scl) { scl.selected = (scl.id === school.id) || "hide"; };
              angular.forEach($scope.all_schools, selFunction);
            },
            maxHeight: function () {
                return $(window).height() - 220 + 'px';
            },
            NavigationActive: function(tab) {
                $scope.tab_name = tab;
            },
            userLocation: function() {
              $scope.durham.autoDiscover = true;
              var unbindWatch = $scope.$watch('durham.autoDiscover', function() {
                if(!$scope.durham.autoDiscover) {
                  $scope.address = '';
                  $scope.durham.zoom = 15;
                  moveLoc($scope.durham.lat, $scope.durham.lng);
                  unbindWatch();
                }
              });
            },
            relocate: function() {
              var lookup_address = ($scope.address.indexOf("durham") == -1) ? $scope.address + " Durham County NC": $scope.address;
              Geodecoder.geocode( { 'address': lookup_address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                  var geo = results[0].geometry.location;
                  moveLoc(geo.lat(), geo.lng());
                } else {
                  alert('Geocode was not successful for the following reason: ' + status);
                }
              });
            },
            durham: {
              //TODO Decide whether we want to limit map scrolling to Durham county area
              /*
              maxbounds: {
                southWest: { lat: 35.83, lng: -79.1},
                northEast: { lat: 36.28, lng: -78.6}
              },
              */
              lat: 36, lng: -78.9, zoom: 13
            },
            markers: {
              home: {
                //TODO Decide whether to allow for dragging before address input
                //TODO Where to put icon before having an address? Near search input?
                //lat: 36, lng: -78.9, // center of default map
                focus: false, draggable: true, mouseover: false,
                zIndexOffset: 1000,
                icon: {
                  type: 'div',
                  iconSize: [32, 32],
                  iconAnchor: [16, 16],
                  className: 'fa fa-home fa-3x'
                }
              }
            },
            position: { lat: 36, lng: -78.9 },
            tiles: {
              name: 'School Mapbox',
              url: 'https://{s}.tiles.mapbox.com/v4/vrocha.j3fib8g6/{z}/{x}/{y}.png32?access_token=pk.eyJ1IjoidnJvY2hhIiwiYSI6Ijc4VTRqNlkifQ.IAL1V6TtIekAMo2sP61J3Q',
              attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
              type: 'xyz'
            },
            events: { markers:{ enable: [ 'click', 'dragend', 'mouseover', 'mouseout' ] } },
            highlight_school: function(schoolId) {
              $scope.schools.forEach(function(school) {
                school.hover = (school.id === schoolId);
              });
              var legend = { position: 'topright', colors: [], labels: [] };
              $scope.districts.forEach(function(district) {
                if(district.id === schoolId && district.geometry !== null) {
                  $scope.geojson.data.push(district);
                  legend.colors.push($scope.zoneTypes[district.properties.zoneType].color);
                  legend.labels.push($scope.zoneTypes[district.properties.zoneType].label);
                }
              });
              $scope.legend = legend.colors.length ? legend : null;
            },
            clear_highlight: function() {
              $scope.schools.forEach(function(school) {
                school.hover = false;
              });
              $scope.geojson.data = [];
              $scope.legend = null;
            },
            focus: function(school) {
              $scope.durham.lat = school.lat || school.location.coordinates[1];
              $scope.durham.lng = school.lng || school.location.coordinates[0];
            },
            prevDistricts: [],
            districts: [],
            switchTab: function (eligibility) {
              $scope.eligibility = eligibility;
              loadMarkers($scope.all_schools);
              $scope.toggleSelectSchool({selected: true});
            },
            levelStyles: {
              'elementary': '#48BC6B',
              'secondary': '#3F899E',
              'middle': '#3F899E',
              'high': '#4F61AD'
            },
            levels: ['elementary', 'secondary', 'middle', 'high'],
            zoneTypes: {
              'district': { color: 'black', label: 'Neighborhood' },
              'traditional_option_zone': { color: 'purple', label: 'Traditional Option'},
              'year_round_zone': { color: 'blue', label: 'Year Round'},
              'priority_zone': { color: 'red', label: 'Priority'},
              'choice_zone': { color: 'yellow', label: 'Choice'},
              'walk_zone': { color: 'green', label: 'Walk'}
            },
            legend: null,
            geojson: {
              data: [],
              style: function(feature) {
                return {
                  fillColor: $scope.levelStyles[feature.properties.level],
                  color: $scope.zoneTypes[feature.properties.zoneType].color
                };
              },
            }
          });
          if ($params.addr) {
              $scope.address = $params.addr;
          }
          if($params.lat && $params.lng) {
            moveLoc($params.lat, $params.lng);
          }

          function moveLoc(lat, lng) {
            $scope.markers.home.lat = $scope.durham.lat = $scope.position.lat = Number(lat);
            $scope.markers.home.lng = $scope.durham.lng = $scope.position.lng = Number(lng);
            $location.search({lat: lat, lng: lng, addr: $scope.address});
            Schools.get_schools($scope.position).success(function(data) {
              loadMarkers(data);
            });
          }
          function loadMarkers(data) {
              $scope.markers = { home: $scope.markers.home };
              $scope.all_schools = data;
              $scope.schools = [];
              data.filter(function(a) {
                return a.eligibility === $scope.eligibility || (a.eligibility === "option" && a.type === $scope.eligibility);
              }).forEach(function(school) {
                var schoolObj = {
                  id: school.id,
                  message: school.name,
                  lat: school.location.coordinates[1],
                  lng: school.location.coordinates[0],
                  icon: {
                    type: 'div',
                    iconSize: [50, 50],
                    iconAnchor: [25, 25],
                    popupAnchor:  [0, -10],
                    html: school.short_name,
                    className: "school_point " + school.level,
                  }
                };
                this[school.name.replace(/[\.\-\W]/g,'')] = schoolObj;
                $scope.schools.push(school);
              }, $scope.markers);
              data.filter(function(a) {
                return $scope.prevDistricts.indexOf(a.id) === -1 && // Have we already fetched district?
                  a.type !== 'charter' && // Is it a charter? (doesn't have a geographic zone)
                  (a.eligibility === $scope.eligibility || // Is eligibility 'assigned'?
                  (a.eligibility === "option" && a.type === $scope.eligibility)); // Is type 'magnet' or 'charter'?
              }).forEach(function(school) {
                $scope.prevDistricts.push(school.id);
                var districtArray = this;
                Schools.get(school.id).success(function(this_school) {
                  Object.keys($scope.zoneTypes).forEach(function(zone) {
                    if(this_school.hasOwnProperty(zone)) {
                      var district = {
                        id: school.id, type: 'Feature',
                        properties: { level: this_school.level, zoneType: zone },
                        geometry: this_school[zone]
                      };
                      districtArray.push(district);
                    }
                  });
                });
              }, $scope.districts);
          }
          $scope.$on("leafletDirectiveMarker.leaflet-map.dragend", function(event, args) {
            moveLoc(args.model.lat, args.model.lng);
            $scope.address = '';
          });
          $scope.$on("leafletDirectiveMarker.leaflet-map.mouseover", function(event, args) {
            $scope.highlight_school(args.model.id);
          });
          $scope.$on("leafletDirectiveMarker.leaflet-map.mouseout", function(event, args) {
            $scope.clear_highlight();
          });
          $scope.$on("leafletDirectiveMarker.leaflet-map.click", function(event, args) {
            $scope.focus(args.model);
          });
        }]);

angular.module('SchoolsApp.directives', [])
    .directive( 'goClick', function ( $location ) {
      return function ( scope, element, attrs ) {
        var path;

        attrs.$observe( 'goClick', function (val) {
          path = val;
        });

        element.bind( 'click', function () {
          scope.$apply( function () {
            $location.path( path );
          });
        });
      };
    })
    .directive('simpleNav', [function() {
        return {
            restrict: 'AE',
            templateUrl: 'app/templates/simpleNav.html'
        }
    }])
    .directive('search', [function() {
        return {
            restrict: 'AE',
            templateUrl: 'app/templates/search.html'
        }
    }])
    .directive('tooltip', [function(){
      return {
          restrict: 'A',
          link: function(scope, element, attrs){
              $(element).hover(function(){
                  // on mouseenter
                  $(element).tooltip('show');
              }, function(){
                  // on mouseleave
                  $(element).tooltip('hide');
              });
          }
      };
    }])
    .directive('reflexions', ['Schools', function(Schools) {
      return {
          restrict: 'AE',
          templateUrl: 'app/templates/reflexions.html',
          link: function(scope, element, attrs){
              console.log(attrs);
              Schools.get_reflexions().success(function(data) {
                  scope.reflexions = data;
              });
          }
      };
    }]);

app.filter('gradeString', [function() {
    var gradeNames = ['PreK3', 'PreK4', 'K', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    return function (gradeNumber) {
      //-2 = preK3, -1 = preK4, 0 = K, 1 = 1, ...
      return gradeNames[gradeNumber + 2];
    }
}]);
