app.service('apiService', function(){
    const KEY = 'YOUR KEY HERE';
    const MAX_PAGES = 40;

    this.getKey = function(){
        return KEY;
    }

    this.getMaxPages = function(){
        return MAX_PAGES;
    }
});