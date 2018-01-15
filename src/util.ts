export const makeRandomString = function(length:number){
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var str:string =""
    for (var i = 0; i < length; i++)
        str += possible.charAt(Math.floor(Math.random() * possible.length));

    return str
}
  