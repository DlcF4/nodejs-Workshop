var a =4; 
console.log(typeof a);
// --> 'number' 
a ='yty'; 
console.log(typeof a);
// --> 'string'
a =[1,2,3,4]
console.log(typeof a);
// --> 'object'   
console.log(typeof a[0]);
1 
console.log(typeof a[05]);
undefined
a.push('fr');
5
console.log(a);
[ 1, 2, 3, 4, 'fr' ]

a={'nome':'Mario','cognome':'Rossi','indirizzo':'Via Verdi, 25'}; 
// --> { nome: 'Mario', cognome: 'Rossi', indirizzo: 'Via Verdi, 25' } 
console.log(a.indirizzo);
// --> 'Via Verdi, 25'