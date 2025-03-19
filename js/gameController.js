app.controller('gameController', function($scope, $http, apiService) {

    $scope.page = 1;
    $scope.games = [];
    $scope.genreLabelsArray = [];
    $scope.devLabelsArray = [];
    $scope.labels = [];
    $scope.genreLabelObjects = [];
    $scope.currentGenreLabels = [];
    $scope.devLabelObjects = [];
    $scope.currentDevLabels = [];

    $scope.loadGames = function() {
        const promises = [];

        for (let i = $scope.page; i <= apiService.getMaxPages(); i++) {
            promises.push(
                $http.get(`https://api.rawg.io/api/games?key=${apiService.getKey()}&page=${i}`).then(function(response) {
                    if (response.data && response.data.results && response.data.results.length) {
                        $scope.games = $scope.games.concat(response.data.results);
                    }
                }, function(error) {
                    console.error("Error loading games from page " + i, error);
                })
            );
        }

        Promise.all(promises).then(() => {
            $scope.getLabelsAndDevelopers();
        });
    };

    $scope.loadGames();

    $scope.getLabelsAndDevelopers = function() {
        const promises = $scope.games.map(game => {
            return $http.get(`https://api.rawg.io/api/games/${game.slug}?key=${apiService.getKey()}`).then(response => {
                game.detailedInformation = response.data;
                game.developers = game.detailedInformation.developers.map(dev => dev.name).join(", ");
                game.genres = game.genres.map(genre => genre.name).join(", ");
                $scope.genreLabelsArray.push(...game.genres.split(", "));
                $scope.devLabelsArray.push(...game.developers.split(", "));
            });
        });

        Promise.all(promises).then(() => {
            $scope.labels = [...new Set($scope.genreLabelsArray)];
            $scope.labels.sort().forEach(label => {
                if (label !== "") $scope.genreLabelObjects.push({ name: label, checked: false });
            });

            $scope.labels = [...new Set($scope.devLabelsArray)];
            $scope.labels.sort().forEach(label => {
                if (label !== "") $scope.devLabelObjects.push({ name: label, checked: false });
            });

            $scope.$apply();
        }).catch(error => {
            console.error("Error in fetching detailed game information:", error);
        });
    };

    $scope.changeGenreCheckbox = function(index) {
        $scope.genreLabelObjects[index].checked = !$scope.genreLabelObjects[index].checked;
        $scope.currentGenreLabels = $scope.genreLabelObjects.filter(obj => obj.checked).map(obj => obj.name);
    };

    $scope.changeDevCheckbox = function(index) {
        $scope.devLabelObjects[index].checked = !$scope.devLabelObjects[index].checked;
        $scope.currentDevLabels = $scope.devLabelObjects.filter(obj => obj.checked).map(obj => obj.name);
    };

    $scope.filterGamesByGenre = function(game) {
        if ($scope.currentGenreLabels.length === 0) {
            return true;
        }
        let gameLabels = game.genres.split(", ");
        return $scope.currentGenreLabels.every(label => gameLabels.includes(label));
    };

    $scope.filterGamesByDev = function(game) {
        if ($scope.currentDevLabels.length === 0) {
            return true;
        }
        let devLabels = game.developers.split(", ");
        return $scope.currentDevLabels.every(dev => devLabels.includes(dev));
    };

});