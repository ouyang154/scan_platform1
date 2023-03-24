export function rle_decode(rle){
    let indexlist=[]
    for(let i=0; i<rle.length;i++){
        if(rle[i].length>0){
        let x1=parseInt(rle[i][0]/54720)
        let y1=rle[i][0]%54720
        for(let j=rle[i][0];j<rle[i][1];j++){
            indexlist=indexlist.concat([[x1,y1]])
            y1=y1+1
        }
        }          
    }
    return indexlist
}

export function rle_encode(indexlist){
    let mask_list=[]
    for(let i=0;i<indexlist.length;i++){
        mask_list=mask_list.concat(indexlist[i][0]*54720+indexlist[i][1])
    }
    mask_list=mask_list.sort()
    mask_list=mask_list.concat(0)
    let count=0
    let rle=[]
    for(let i=0;i<mask_list.length-1;i++){
        count++
        if((mask_list[i+1]-mask_list[i])!=1){
        rle=rle.concat([[mask_list[i]-count,mask_list[i]]])
        count=0
        }          
    }
    return rle
}

export function filterClass(value) {
    return value ==1? "nucleus"
        :value ==2? "squamous"
        :"nucleus";  
}
export function filterColor(value) {
    return value =="nucleus"?'red'
        :value =="squamous"?'blue'
        :"black"; 
}
export function invertfilterClass(value) {
    return value =="nucleus"?'1'
        :value =="squamous"?'2'
        :"0";
}


// DPI 一个像素代表多少um
export function getDPI() {
    var dpi = findFirstPositive(x => matchMedia(`(max-resolution: ${x}dpi)`).matches)
    return dpi;
}

export function findFirstPositive(b, a, i, c) {
    c=(d,e)=>e>=d?(a=d+(e-d)/2,0<b(a)&&(a==d||0>=b(a-1))?a:0>=b(a)?c(a+1,e):c(d,a-1)):-1
    for (i = 1; 0 >= b(i);) i *= 2
    return c(i / 2, i)|0
}