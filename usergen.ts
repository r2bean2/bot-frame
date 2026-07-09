function getName() {
    function randInt(min:number, max:number) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    const array = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
                'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
                '1','2','3','4','5','6','7','8','9','_','_'];
    let string = ''


    for (let i = 0; i < 16; i++) {
        string = string + array[randInt(0, 62)];
    }
    return string
}