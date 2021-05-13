const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun' ,'Jul', 'Aug' ,'Sep', 'Oct', 'Nov', 'Dec'];
const monthFull = ['January', 'February', 'March', 'April', 'May', 'June' ,
                    'July', 'August' ,'September', 'October', 'November', 'December'];

function getShortDate(date) {
    return date.getDate() + " " + monthShort[date.getMonth()] + " " + date.getFullYear();
}

function getLongDate(date) {
    return date.getDate() + " " + monthFull[date.getMonth()] + " " + date.getFullYear();
}

function CapAndJoin(array) {
    var newarray = [];
    array.forEach(element => {
        var newelement = element.charAt(0).toUpperCase() + element.slice(1);
        newarray.push(newelement);
    });
    return newarray.join(', ');
}

function findLiked(array, movieid) {
    const result = array.includes(movieid);
    return result; 
}

function getRatingColor(rating, type) {
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

function capRating(rating) {
    if (rating === 'g') return 'G';
    else if (rating === 'pg') return 'PG';
    else if (rating === 'pg13') return 'PG-13';
    else if (rating === 'r') return 'R';
    else if (rating === 'nc17') return 'NC-17';
    else return 'no rating';
}

module.exports = {
    getShortDate : getShortDate,
    getLongDate : getLongDate,
    findLiked : findLiked,
    CapAndJoin : CapAndJoin,
    capRating : capRating,
    getRatingColor : getRatingColor
}