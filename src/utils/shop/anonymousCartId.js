
// // utils/shop/AnonymousCartId.js
// export function AnonymousCartId() {
//     if (typeof window === "undefined") return null;
  
//     let anonId = localStorage.getItem("anonymousCartId");
//     if (!anonId) {
//       anonId = crypto.randomUUID(); // Or any other random string generator
//       localStorage.setItem("anonymousCartId", anonId);
//     }
  
//     return anonId;
//   }
  