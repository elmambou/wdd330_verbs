import LocalStorage from './localStorage.js';

export default class Quiz {
   constructor() {
      this.ls = new LocalStorage();
      this.verbs = this.ls.getCompressedArray('verbs');
      this.forms = ['f1p','f1s','f2p','f2s','f3p','f3s','gerund','past_participle'];
      this.FormsDB = {f1p:'Form_1p',f1s:'Form_1s',f2p:'Form_2p',f2s:'Form_2s',f3p:'Form_3p',f3s:'Form_3s',gerund:'Gerund',
                      past_participle:'PastParticiple'};
      this.Forms = {f1p:'1st Person Plural',f1s:'1st Person Singular',f2p:'2nd Person Plural',f2s:'2nd Person Singular',
                    f3p:'Third Person Plural',f3s:'3rd Person Singular',gerund:'Gerund',past_participle:'Past Participle'};
      this.moods_tenses = ['indicative_present','indicative_future','indicative_imperfect','indicative_preterite',
                     'indicative_conditional','indicative_present_perfect','indicative_future_perfect','indicative_past_perfect',
                     'indicative_preterite_archaic','indicative_conditional_perfect','subjunctive_present','subjunctive_imperfect',
                     'subjunctive_future','subjunctive_present_perfect','subjunctive_future_perfect','subjunctive_past_perfect',
                     'imperative_affirmative_present','imperative_negative_present'];
      this.moods = ['indicative','subjunctive','imperative_affirmative','imperative_negative'];
      this.Moods = {indicative:'Indicative',subjunctive:'Subjunctive',imperative_affirmative:'Imperative Affirmative',imperative_negative:'Imperative Negative'}
      this.tenses = ['present','future','imperfect','preterite','conditional','present_perfect','future_perfect','past_perfect','preterite_archaic','conditional_perfect'];
      this.Tenses = {present:'Present',future:'Future',imperfect:'Imperfect',preterite:'Preterite',conditional:'Conditional',
                     present_perfect:'Present Perfect',future_perfect:'Future Perfect',past_perfect:'Past Perfect',
                     preterite_archaic:'Preterite (Archaic)',conditional_perfect:'Conditional Perfect'};
      
                     this.quizVerbs = [];
      this.loadQuizVerbs();
      const to = this;
      $('#btnNextQuiz').click(function() {
         if (to.quizVerbs.length == 0) {
            $('#question').html("Add some verbs in 'Learn'");
            $('#answer').html("Add some verbs in 'Learn'");
         } else {
            to.getQuizVerb();
         }
      });
      $('#btnNextQuiz').click();
   }

   loadVerb(verb) {
      let verbObject = this.verbs.find(v => v.infinitive == verb);
      // See if the verb already is not in the array
      if (verbObject === undefined && verb !== undefined) {
         verbObject = this.makeEmptyVerb(verb)
         this.verbs.push(verbObject);
         this.ls.setCompressedArray('verbs',this.verbs);
      }
      const to = this;
      $.each(to.moods_tenses, function(k,v) {
         $.each(to.forms, function(k2,v2) {
            if (verbObject[to.moods_tenses[k]][to.forms[k2]]) {
               $(`#${to.moods_tenses[k]}_${to.forms[k2]}`).addClass('highlighted');
            } else {
               $(`#${to.moods_tenses[k]}_${to.forms[k2]}`).removeClass('highlighted');
            }
         });
      });
   }

   remember(infinitive, id) {
      let mood_tense = this.getMood_Tense(id);
      let form = this.getForm(id);
      this.updateVerb(infinitive, mood_tense, form, 1);
   }

   forget(infinitive, id) {
      let mood_tense = this.getMood_Tense(id);
      let form = this.getForm(id);
      this.updateVerb(infinitive, mood_tense, form, 0);
   }

   updateVerb(infinitive, mood_tense, form, status) {
      for (let x = 0; x < this.verbs.length; x++) {
         if (this.verbs[x]['infinitive'] === infinitive) {
            this.verbs[x][mood_tense][form] = status;
            this.ls.setCompressedArray('verbs', this.verbs);
            this.loadQuizVerbs();
            $('#btnNextQuiz').click();
            return;
         }
      }
   }

   getMood(id) {
      for(let x = 0; x < this.moods.length; x++) {
         if (id.includes(this.moods[x])) return this.moods[x];
      }    
   }

   getTense(id) {
      for(let x = 0; x < this.tenses.length; x++) {
         if (id.includes(this.tenses[x])) return this.tenses[x];
      }    
   }

   getMood_Tense(id) {
      for(let x = 0; x < this.moods_tenses.length; x++) {
         if (id.includes(this.moods_tenses[x])) return this.moods_tenses[x];
      }
   }

   getForm(id) {
      for(let x = 0; x < this.forms.length; x++) {
         if (id.includes(this.forms[x])) return this.forms[x];
      }
   }

   makeEmptyVerb(infinitive) {
      let english = $("#verbs option:selected").text();
      english = english.replace(`${infinitive} - `,'');
      let verb = {infinitive:infinitive, id: $('#verbs').val(), english: english};
      
      for(let x = 0; x < this.moods_tenses.length; x++) {
         verb[this.moods_tenses[x]] = {};
         for (let y = 0; y < this.forms.length; y++) {
            verb[this.moods_tenses[x]][this.forms[y]] = 0;
         }
      }
      return verb;
   }

   checkit() {
      let verb = this.ls.getCompressedObject('test');   
   }

   loadQuizVerbs() {
      this.quizVerbs = [];
      const to = this;
      $.each(to.verbs, function(verbKey,verb) {
         $.each(to.moods_tenses, function(mood_tenseKey,mood_tense) {
            let mood = to.getMood(mood_tense);
            let tense = to.getTense(mood_tense);
            $.each(to.forms, function(formKey,form) {
               if (verb[to.moods_tenses[mood_tenseKey]][to.forms[formKey]]) {
                  to.quizVerbs.push({id: verb.id, english: verb.english, mood: mood, tense: tense, form: form});
               }
            });
         });
      });
   }
   
   getQuizVerb() {
      var quizVerb = this.quizVerbs[Math.floor(Math.random() * this.quizVerbs.length)];
      this.fetchJson(`https://trentonsouth.com/spanish/api/?verb_by_id/${quizVerb.id}`)
      .then(data => {
         this.loadQuizVerb(data,quizVerb);
      });
   }

   fetchJson(url) {
      return fetch(url)
         .then(response => response.json());
   }

   loadQuizVerb(verb,quizVerb) {
      let tense = this.Tenses[quizVerb.tense];
      let mood = this.Moods[quizVerb.mood];
      let form = this.Forms[quizVerb.form];
      let formDB = this.FormsDB[quizVerb.form];
      const mood_tense = verb.find(v => v.Tense == tense && v.Mood == mood);
      const question = `Verb: ${quizVerb.english} <br><br>Mood: ${mood} <br><br>Tense: ${tense} <br><br>Form: ${form}`;
      const answer = mood_tense[formDB];
      $('#question').html(question);
      $('#answer').html(answer);
   }
}