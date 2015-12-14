
var app = angular.module('TwitterMapper', [])
	app.directive('ngtwittermapper', function() {
		return {


			controllerAs: 'twitterMapper',
			controller: ['$http', function tweetsCtrl($http) {
				this.$http = $http;

				var self = this;


				this.createUser = function(){
					var userData = {
						username: this.formUsername,
						password_hash: this.formPassword
					};
					console.log(userData);
					self.$http.post('/users', userData).then(function success(response){
						self.formUsername = '';
						self.formPassword = '';
					},function error() {
						console.log('error');
					});
				}



				this.loginUser = function(){
					var userData = {
						username: this.formLoginUsername,
						password_hash: this.formLoginPassword
					};
					// console.log(userData);
					self.$http.post('/users/login', userData).then(function success(response){
						self.formLoginUsername = '';
						self.formLoginPassword = '';
					},function error() {
						console.log('error');
					});
				}
			}]
		}
	});








