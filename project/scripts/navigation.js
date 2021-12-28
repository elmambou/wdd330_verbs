export default class Navigation {

   constructor() {
      const tc = this;
      $('.btnHome').click(function() {
         tc.showHome(tc);
      });
      $('.btnInstructions').click(function() {
         tc.showInstructions(tc);
      });
      $('.btnQuiz').click(function() {
         tc.showQuiz(tc);     
      });
      $('.btnLearn').click(function() {
         tc.showLearn(tc);
      });
   }
   
   showHome(tc) {
      tc.hideAll();
      $('#home').show();
   }

   showInstructions(tc) {
      tc.hideAll();
      $('#instructions').show();
   }
   
   showQuiz(tc) {
      tc.hideAll();
      $('#quiz').show();
   }

   showLearn(tc) {
      tc.hideAll();
      $('#learn').show();
   }
   
   
   hideAll() {
      $('#instructions').hide();
      $('#learn').hide();
      $('#quiz').hide();
      $('#home').hide();
   }
   
}