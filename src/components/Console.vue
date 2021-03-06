<template>
  <div class="console-root">
    <div class="console-messages">
      <div v-for="row in console.rows" :key="row.id" class="console-messages-row">
        <div class="time">{{ row.date.toLocaleTimeString("ru") }}</div>
        <div class="text" :class="row.type" v-html="row.text"></div>
      </div>
    </div>
    <div class="console-col console-input">
      <div>Input:</div>
      <div v-for="(inputVar, i) in console.input" :key="`input-${i}`">
        <div class="text" v-html="inputVar" @mouseenter="hoverVar" @mouseleave="hoverVarEnd"></div>
      </div>
    </div>
    <div class="console-col console-output">
      <div>Output:</div>
      <div v-for="(outputVar, i) in console.output" :key="`output-${i}`">
        <div class="text" v-html="outputVar" @mouseenter="hoverVar" @mouseleave="hoverVarEnd"></div>
      </div>
    </div>
    <div class="console-col console-commands">
      <div>Commands:</div>
      <div v-for="(commandVar, i) in console.commands" :key="`commands-${i}`">
        <div class="text" v-html="commandVar" @mouseenter="hoverVar" @mouseleave="hoverVarEnd"></div>
      </div>
    </div>
    <div class="console-cost">
      <div class="cost-block">Energy: {{ console.energy }}</div>
      <div class="cost-block">Cost: {{ console.cost }}</div>
    </div>
    <div class="popup" v-show="showPopup" v-html="popupText" :style="popupStyle"></div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {mapState} from "vuex";

type ErrorCommand = {
  errorType: number;
  message: string;
};

type CodeInputOutput = {
  Input: string[];
  Output: string[];
  Commands: string[];
  Cost: number;
  Energy: number;
};

@Component({
  computed: mapState(["console"]),
})
export default class Console extends Vue {
  showPopup: boolean = false;
  popupText: string = "some popup stub text";
  popupStyle: {top: string; left: string} = {top: "100px", left: "200px"};
  wsCommands = {
    codeError(this: Console, errorPayload: ErrorCommand) {
      let msg;
      switch (errorPayload.errorType) {
        case 0:
          msg = "Lexing";
          break;
        case 1:
          msg = "Parsing";
          break;
        case 2:
          msg = "Runtime";
          break;
      }
      msg = msg + " error: " + errorPayload.message.replace(/\n/g, "<br/>");
      this.$store.commit("addConsoleError", msg);
    },
    codeInputOutput(this: Console, payload: CodeInputOutput) {
      this.$store.commit("setConsoleInputOutput", payload);
    },
  };

  hoverVar(event: any) {
    if (event.target.innerText.length < 30) {
      return;
    }
    this.popupText = event.target.innerText;
    this.showPopup = true;
    this.popupStyle.left = event.clientX + 10 + "px";
    this.popupStyle.top = event.clientY + 10 + "px";
  }

  hoverVarEnd() {
    this.showPopup = false;
  }
}
</script>

<style scoped lang="stylus">
@import "../assets/style/variables.styl"
.console-root
  display grid
  grid-template-areas "console-messages console-input console-output console-commands"\
                      "console-messages console-cost console-cost console-cost"
  grid-template-columns 2fr 1fr 1fr 1fr
  grid-template-rows 1fr 15px
  grid-gap 3px
  border 2px solid panels-border-color
  background-color panels-bg
  font-family monospace
  font-size 10pt
  padding 6px
  margin 0
  max-height 300px
  overflow hidden
  .time
    width 75px

.error
  color #cb575d

.console-messages
  grid-area console-messages
.console-input
  grid-area console-input
.console-output
  grid-area console-output
.console-commands
  grid-area console-commands

.console-cost
  grid-area console-cost
  display flex
  flex-direction row
  border-top 2px solid panels-border-color
  .cost-block
    padding-right 10px

.console-messages-row
  display flex
  flex-direction row
  .time
    width 80px

.console-col
  border-left 2px solid panels-border-color
  padding-left 4px
  overflow auto
  .text
    text-overflow ellipsis
    overflow hidden
    white-space nowrap

.popup
  position absolute
  min-width 400px
  border 2px solid black
  padding 5px
  background-color white
  z-index 9999
</style>
