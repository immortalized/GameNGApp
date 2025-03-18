app.controller('gameController', function($scope, $http) {

    $scope.games = [];
    $scope.genreLabelsArray = [];
    $scope.devLabelsArray = [];
    $scope.labels = [];
    $scope.genreLabelObjects = [];
    $scope.currentGenreLabels = [];
    $scope.devLabelObjects = [];
    $scope.currentDevLabels = [];

    $http.get("../json/games.json?page=" + $scope.page).then(function(response) {
            $scope.games = $scope.games.concat(response.data.games);
            $scope.getLabelsAndDevelopers();
        },
        function(error) {
            console.error("Error loading games:", error);
        });

    $scope.getLabelsAndDevelopers = function() {
        $scope.games.forEach(game => {
            $scope.labelsInGame = game.genre.split(", ");
            $scope.labelsInGame.forEach(label => {
                $scope.genreLabelsArray.push(label);
            });
            $scope.devLabelsArray.push(game.developer);
        });

        $scope.labels = [...new Set($scope.genreLabelsArray)];
        $scope.labels.forEach(label => {
            $scope.genreLabelObjects.push({ name: label, checked: false });
        });

        $scope.labels = [...new Set($scope.devLabelsArray)];
        $scope.labels.forEach(label => {
            $scope.devLabelObjects.push({ name: label, checked: false });
        });
    }

    $scope.changeGenreCheckbox = function(index) {
        $scope.genreLabelObjects[index].checked = !$scope.genreLabelObjects[index].checked;
        $scope.currentGenreLabels = $scope.genreLabelObjects.filter(obj => obj.checked).map(obj => obj.name);
    }

    $scope.changeDevCheckbox = function(index) {
        $scope.devLabelObjects[index].checked = !$scope.devLabelObjects[index].checked;
        $scope.currentDevLabels = $scope.devLabelObjects.filter(obj => obj.checked).map(obj => obj.name);
    }

    $scope.filterGamesByGenre = function(game) {
        if ($scope.currentGenreLabels.length === 0) {
            return true;
        }
        let gameLabels = game.genre.split(", ");
        return $scope.currentGenreLabels.every(label => gameLabels.includes(label));
    }

    $scope.filterGamesByDev = function(game) {
        if ($scope.currentDevLabels.length === 0) {
            return true;
        }
        return $scope.currentDevLabels.includes(game.developer);
    }

});