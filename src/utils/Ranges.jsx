// This will take into mind your position, and the best range chart that was found for you to play.
export const FindBestPlay = (position, range_charts) => {

}
// Checks to see if the player is the first to raise.
const hasRaised = (roundActionLog) => {
    if (roundActionLog.incudes("Raise")) {
        return True;
    }
    else {
        return false;
    }
}
const range_charts = () => {
    const FirstToRaise_UTG_BestActionRaise = // If not in this chart, then best action is to fold.
        ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A5s",
         "AKo", "KK", "KQs", "KJs", "KTs",
         "AQo", "QQ", "QJs", "QTs",
         "JJ", "JTs",
         "TT", "T9s", 
         "99", "98s",
         "88", "77", "66"];
         
    const FirstToRaise_UTGp1_BestActionRaise = // If not in this chart, then best action is to fold.
        ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s",
         "AKo", "KK", "KQs", "KJs", "KTs", "K9s",
         "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s",
         "AJo", "JJ", "JTs", "J9s",
         "TT", "T9s",
         "99", "98s",
         "88", "87s",
         "77",
         "66"]
   
    const FirstToRaise_UTGp2_BestActionRaise = // If not in this chart, then best action is to fold.
    ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s",
     "AKo", "KK", "KQs", "KJs", "KTs", "K9s",
     "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s",
     "AJo", "JJ", "JTs", "J9s",
     "TT", "T9s",
     "99", "98s",
     "88", "87s",
     "77", "76s",
     "66",
     "55"]
     
    const FirstToRaise_Lojack_BestActionRaise = // If not in this chart, then best action is to fold.
    ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s",
     "AKo", "KK", "KQs", "KJs", "KTs", "K9s",
     "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s",
     "AJo", "KJo", "JJ", "JTs", "J9s",
     "ATo", "TT", "T9s",
     "99", "98s",
     "88", "87s",
     "77", "76s",
     "66", "65s",
     "55",
     "44"]
     
     const FirstToRaise_Hijack_BestActionRaise = // If not in this chart, then best action is to fold.
     ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s",
      "AKo", "KK", "KQs", "KJs", "KTs", "K9s", "K8s",
      "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s",
      "AJo", "KJo", "QJo", "JJ", "JTs", "J9s",
      "ATo", "TT", "T9s", "T8s",
      "99", "98s", "97s",
      "88", "87s",
      "77", "76s",
      "66", "65s",
      "55", "54s",
      "44",
      "33",
      "22"]
      
      const FirstToRaise_Cutoff_BestActionRaise = // If not in this chart, then best action is to fold.
      ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s",
       "AKo", "KK", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s",
       "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "Q8s",
       "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s",
       "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s",
       "A9o", "99", "98s", "97s",
       "88", "87s", "86s",
       "77", "76s", "75s",
       "66", "65s", "64s",
       "55", "54s",
       "44", "43s",
       "33",
       "22"]
       const FirstToRaise_Button_BestActionRaise = // If not in this chart, then best action is to fold.
       ["AA", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s",
        "AKo", "KK", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s",
        "AQo", "KQo", "QQ", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s",
        "AJo", "KJo", "QJo", "JJ", "JTs", "J9s", "J8s", "J7s", "J6s",
        "ATo", "KTo", "QTo", "JTo", "TT", "T9s", "T8s", "T7s", "T6s",
        "A9o", "K9o", "Q9o", "J9o", "T9o", "99", "98s", "97s", "96s",
        "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "88", "87s", "86s", "85s",
        "A7o", "K7o", "97o", "87o", "77", "76s", "75s", "74s",
        "A6o", "76o", "66", "65s", "64s",
        "A5o", "55", "54s", "53s",
        "A4o", "44", "43s",
        "A3o", "33", "32s",
        "A2o", "22"]
        const FirstToRaise_SB_BestActionRaiseValue = // Raise for value
        ["AKs", "AQs", "AJs", "ATs",
         "KQs", "KJs",
         "AQo", "KQo", "QQ", "QJs",
         "AJo", "KJo", "JJ",
         "ATo", "TT",
         "99",
         "88"]
         const FirstToRaise_SB_BestActionRaiseBluff = // Raise for a bluff
         ["J4s", "J3s", "J2s",
          "T5s", "T4s",
          "95s", "94s",
          "85s", "84s",
          "74s",
          "J6o", "T6o", "96o", "86o", "63s",
          "Q5o", "53s",
          "Q4o", "43s",
          "K3o", "Q3o",
          "K2o", "Q2o"]
          const FirstToRaise_SB_BestActionLimp = // Call to see the flop
          ["AA", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s",
           "AKo", "KK", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s",
           "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s",
           "QJo", "JTs", "J9s", "J8s", "J7s",
           "KTo", "QTo", "JTo", "T9s", "T8s", "T7s", "T6s",
           "A9o", "K9o", "Q9o", "J9o", "T9o", "98s", "97s", "96s",
           "A8o", "K8o", "Q8o", "J8o", "T8o", "98o", "87s", "86s",
           "A7o", "K7o", "Q7o", "J7o", "T7o","97o", "87o", "77", "76s", "75s",
           "A6o", "K6o", "Q6o", "76o", "66", "65s", "64s",
           "A5o", "K5o", "65o", "55", "54s",
           "A4o", "54o",
           "44",
           "A3o", "33", "32s",
           "A2o", "22"]
            
}
