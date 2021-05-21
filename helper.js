const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun' ,'Jul', 'Aug' ,'Sep', 'Oct', 'Nov', 'Dec'];
const monthFull = ['January', 'February', 'March', 'April', 'May', 'June' ,
                    'July', 'August' ,'September', 'October', 'November', 'December'];

var helperFunctions = {};

helperFunctions.getShortDate = function(date) {
    return date.getDate() + " " + monthShort[date.getMonth()] + " " + date.getFullYear();
};

helperFunctions.getLongDate = function(date) {
    return date.getDate() + " " + monthFull[date.getMonth()] + " " + date.getFullYear();
};

helperFunctions.changeDateFormat = function(date) {

    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    var formattedDate = [year, month, day].join('-');
    return formattedDate;
};

helperFunctions.CapAndJoin = function(array) {
    var newarray = [];
    array.forEach(element => {
        var newelement = element.charAt(0).toUpperCase() + element.slice(1);
        newarray.push(newelement);
    });
    return newarray.join(', ');
};

helperFunctions.findLiked = function(array, movieid) {
    const result = array.includes(movieid);
    return result; 
};

helperFunctions.userReviewExists = function(userid, reviewlist) {
    var flag = false;
    reviewlist.forEach(review => {
        if (review.user.id.equals(userid)) {
            flag = true;
        }
    });
    return flag;
};

helperFunctions.canManage = function(user) {
    return user.role === 'admin';
};

helperFunctions.getRatingColor = function(rating, type) {
    if (type === 't'){ // text
        if (rating === 'g') return 'text-primary';
        else if (rating === 'pg') return 'text-success';
        else if (rating === 'pg13') return 'text-light';
        else if (rating === 'r') return 'text-warning';
        else if (rating === 'nc17') return 'text-danger';
        else return '';
        }
    else { // type === b border
        if (rating === 'g') return 'border-primary';
        else if (rating === 'pg') return 'border-success';
        else if (rating === 'pg13') return 'border-light';
        else if (rating === 'r') return 'border-warning';
        else if (rating === 'nc17') return 'border-danger';
        else return '';
    }
}

helperFunctions.capRating = function(rating) {
    if (rating === 'g') return 'G';
    else if (rating === 'pg') return 'PG';
    else if (rating === 'pg13') return 'PG-13';
    else if (rating === 'r') return 'R';
    else if (rating === 'nc17') return 'NC-17';
    else return 'no rating';
}

module.exports = helperFunctions;