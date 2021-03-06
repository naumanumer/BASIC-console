var input;

function BASIC_console(element, width) {

  var backColor = "#212121",
    table,
    lines = 25,
    foreColor = "#fff",
    caretText = "&#9608;";

  this.crntPos = { line: 0, char: 0 };
  this.isCaretShown = false;

  this.init = function () {
    var x, y, tbody, tr, td;

    table = document.createElement('table');
    tbody = document.createElement('tbody');

    for (y = 0; y < lines; y++) {
      tr = document.createElement('tr');
      $(tr).attr('id', `line-${y}`)
      for (x = 0; x < width; x += 1) {
        td = document.createElement('td');
        $(td).attr('id', `line-${y}-col-${x}`)

        td.innerHTML = '&nbsp;';
        td.style.backgroundColor = backColor;
        td.style.color = foreColor;
      
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    element.innerHTML = "";
    element.appendChild(table);
    this.appendInput();
    this.clear();
  };

  this.setBackground = function (color) {
    backColor = color;
    for (y = 0; y < lines; y++) {
      for (x = 0; x < width; x += 1) {
        var td = document.getElementById(`line-${y}-col-${x}`);
        td.style.backgroundColor = color;
      }
    }
  };

  this.setForecolor = function (color) {
    foreColor = color;
    for (y = 0; y < lines; y++) {
      for (x = 0; x < width; x++) {
        var td = document.getElementById(`line-${y}-col-${x}`);
        td.style.color = color;
      }
    }
  };

  this.write = function (text) {
    
    this.removeCaret(this.isCaretShown);
    for (var i = 0, len = text.length; i < len; i++) {
      this.writeChar(text[i], this.crntPos);

      if (this.crntPos.char < width - 1){
        this.crntPos.char++;
      } else {
        this.crntPos.line++;
        this.crntPos.char = 0;
      }
    }
    if(this.isCaretShown)
      this.showCaret();
  };

  this.writeChar = function (char, pos) {
    var x = pos.char,
      y = pos.line;
    var td = document.getElementById(`line-${y}-col-${x}`);
    td.innerHTML = char == " " ? '&nbsp;' : char;

  };

  this.writeAtLine = function (text, lineNum) {
    for (var char = 0; char < width; char++) {
      var td = document.getElementById(`line-${lineNum}-col-${char}`);
      if (text[char])
        td.innerHTML = text[char];
    }
  }

  this.insertLineBreak = function () {
    this.removeCaret(this.isCaretShown);
    this.crntPos.line++;
    this.crntPos.char = 0;
    if(this.isCaretShown)
          this.showCaret();
  }

  this.backSpace = function () {
    this.removeCaret(this.isCaretShown);
    if (this.crntPos.char - 1 < 0) {
      var current = { line: this.crntPos.line - 1, char: width - 1 }
      this.writeChar(" ", current);
      this.crntPos = current;
    } else {
      this.writeChar(" ", { line: this.crntPos.line, char: this.crntPos.char - 1 });
      this.crntPos.char--;
    }
    if(this.isCaretShown)
          this.showCaret();
  }

  this.clear = function () {
    for (var y = 0; y < lines; y++) {
      for (var x = 0; x < width; x++) {
        var td = document.getElementById(`line-${y}-col-${x}`);
        td.innerHTML = "&nbsp";
      }
    }
    this.crntPos.line = 0;
    this.crntPos.char = 0;
    if(this.isCaretShown)
          this.refreshCaret();
  };

  this.clearLine = function (lineNum) {
    for (var i = 0; i < width; i++) {
      var td = document.getElementById(`line-${lineNum}-col-${i}`);
      td.innerHTML = "&nbsp";
    }
    if(this.isCaretShown)
          this.refreshCaret();
  };

  this.scrollUp = function () {
    var nextLine = "";

    for (var i = 0; i < lines; i++) {
      nextLine = this.cloneLine(i + 1);
      this.clearLine(i);
      this.writeAtLine(nextLine, i);
    }

    this.crntPos.line--;
    if(this.isCaretShown)
          this.refreshCaret();
  };

  this.cloneLine = function (lineNum) {
    var text = "";
    for (var x = 0; x < width; x++) {
      var td = document.getElementById(`line-${lineNum}-col-${x}`);
      if (td) {
        if (td.innerHTML)
          text += td.innerHTML;
        else
          text += " ";
      }
    }
    return text;
  }

  this.cloneText = function () {
    var text = ""

    for (var i = 0; i < lines; i++) {
      var line = this.cloneLine(i);
      if (line)
        text += line + "\n";
    }

    return text;
  }

  this.getScreenSize = function () {
    return { width: $(table).width(), height: $(table).height() };
  }

  this.appendInput = function () {
    input = document.createElement('input');
    input.style.height = this.getScreenSize().height;
    input.style.width = this.getScreenSize().width;
    $(input).attr('id', 'console-input')
    element.appendChild(input);
    $(input).focus();
  };


// <-- Caret Actions -->

  this.showCaret = function () {
    var crntElement = this.getElementByPos(this.crntPos.line, this.crntPos.char);
    $(crntElement).html($(crntElement).html()+'<span class="blinking-cursor">'+caretText+'</span>');
    this.isCaretShown = true;
  }

  this.removeCaret = function (caretShow = false) {
    var carettd = this.getElementByPos(this.crntPos.line, this.crntPos.char);
    var tdText = carettd.innerHTML;
    if(tdText.length != 38) {
      tdText = tdText.slice(0, 6) == '&nbsp;' ? '&nbsp;' : tdText.slice(0, 1);
    }
    else
      tdText = '&nbsp;';
    carettd.innerHTML = tdText;
    if (!caretShow)
      this.isCaretShown =false
  }

  this.refreshCaret = function(){
    this.removeCaret(this.isCaretShown);
    this.showCaret();
  }

  this.setCaretText = function(char){
    caretText = char[0];
    this.refreshCaret();
  }

// <!-- Caret Actions -->


// <-- Caret Movements -->

  this.moveCaretUp = function(){
    if (this.crntPos.line>0){
      this.removeCaret(this.isCaretShown);
      this.crntPos.line--
      this.showCaret();
    }
  }
  
  this.moveCaretDown = function(){
    if (this.crntPos.line<lines-1){
      this.removeCaret(this.isCaretShown);
      this.crntPos.line++
      this.showCaret();
    }
  }

  this.moveCaretBack = function(){
    if (this.crntPos.char > 0){
      this.removeCaret(this.isCaretShown);
      this.crntPos.char--
      this.showCaret();
    } else {
      this.removeCaret(this.isCaretShown);
      this.crntPos.char = width-1;
      this.crntPos.line--
      this.showCaret();
    }
  }

  this.moveCaretFore = function(){
    if (this.crntPos.char < width-1){
      this.removeCaret(this.isCaretShown);
      this.crntPos.char++
      this.showCaret();
    } else {
      this.removeCaret(this.isCaretShown);
      this.crntPos.char = 0;
      this.crntPos.line++
      this.showCaret();
    }
  }

  this.moveCaretToHome = function(){
    this.removeCaret(this.isCaretShown);
    this.crntPos.char = 0;
    this.showCaret();
  }

  this.moveCaretToEnd = function(){
    this.removeCaret();
    this.crntPos.char = width-1;
    this.showCaret();
  }

  this.moveCaretTo = function(line, char){
    this.removeCaret();
    this.crntPos.char = char;
    this.crntPos.line = line;
    this.showCaret();
  }

  this.moveCaretToEndOfChar = function(){
    var endOfChar = this.getEndOfWord(this.crntPos.line, this.crntPos.char);
    this.moveCaretTo(endOfChar.line, endOfChar.char);
  }
  
  this.moveCaretToStartOfChar = function(){
    var endOfChar = this.getStartOfWord(this.crntPos.line, this.crntPos.char);
    this.moveCaretTo(endOfChar.line, endOfChar.char);
  }

// <!-- Caret Movements -->

  this.getEndOfWord= function(line, char){
    var x, y, found;
    for (y = line; y < lines; y++) {
      for (x = char+1; x < width; x += 1) {
        var tdText = document.getElementById(`line-${y}-col-${x}`).innerHTML;
        tdChar = tdText.slice(0, 6) == '&nbsp;' ? '&nbsp;' : tdText.slice(0, 1);
        if (tdChar.match(/^[a-z0-9]+$/i) && tdChar!= "&nbsp;") 
            continue;
        else{
          found =true;
          break;
        }
      }
      if(found)
        break;
      x = 0;
    }
    return {line: y, char:x};
  }
  
  this.getStartOfWord= function(line, char){
    var x, y, found;
    for (y = line; y > -1; y--) {
      for (x = char-1; x < -1; x--) {
        var tdText = document.getElementById(`line-${y}-col-${x}`).innerHTML;
        tdChar = tdText.slice(0, 6) == '&nbsp;' ? '&nbsp;' : tdText.slice(0, 1);
        if (tdChar.match(/^[a-z0-9]+$/i) && tdChar!= "&nbsp;") 
            continue;
        else{
          found =true;
          break;
        }
      }
      if(found)
        break;
    }
    return {line: y, char:x};
  }

  this.getElementByPos = function (line, char) {
    return document.getElementById(`line-${line}-col-${char}`);
  }

};
