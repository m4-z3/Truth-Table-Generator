const tokenType = {
    startParentheses: "startParentheses",
    endParentheses: "endParentheses",
    proposition: "proposition",
    not: "not",
    and: "and",
    or: "or",
    conditional: "conditional",
    biconditional: "biconditional",
    endOfInput: "endOfInput"
}

class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    print() {
        return "[" + this.type + ", " + this.value + "]";
    }
}

function isLetter(character) {
    return (65 <= character.charCodeAt() && character.charCodeAt() <= 90) || (97 <= character.charCodeAt() && character.charCodeAt() <= 122);
}

function isNumber(character) {
    return 48 <= character.charCodeAt() && character.charCodeAt() <= 57;
}

class Lexer {
    constructor(input) {
        this.input = input;
        this.position = 0;
    }

    tokenize() {
        let tokens = [];
        let parensChecker = [];
        let token = this.nextToken();

        while (token.type !== tokenType.endOfInput && token != "error") {
            tokens.push(token);
            if (token.type == tokenType.startParentheses) {
                parensChecker.push(token);
            }
            
            if (token.type == tokenType.endParentheses) {
                if (parensChecker.length == 0) {
                    return "error";
                }
                parensChecker.pop();
            }

            token = this.nextToken();
        }

        if (token == "error" || parensChecker.length != 0) {
            return "error";
        }
        return tokens;
    }

    nextToken() {
        if (this.position >= this.input.length) {
            return new Token(tokenType.endOfInput,'');
        }
        
        let char = this.input.charAt(this.position);
        let nextChar = '';
        if (this.position < this.input.length) {
            nextChar = this.input.charAt(this.position + 1);
        }

        if (char == '(') {
            this.position += 1;
            return new Token(tokenType.startParentheses, '(');
        }

        if (char == ')') {
            this.position += 1;
            return new Token(tokenType.endParentheses, ')');
        }

        if (char == '&' && nextChar == '&') {
            this.position += 2;
            return new Token(tokenType.and, "&&");
        }

        if (char == '|' && nextChar == '|') {
            this.position += 2;
            return new Token(tokenType.or, "||");
        }

        if (isLetter(char) || char == '_') {
            let prop = char;
            if (this.position + 1 < this.input.length) {
                char = this.input.charAt(this.position + 1);
                while (isLetter(char) || isNumber(char) || char == '_' ) {
                    prop += char;
                    this.position += 1;
                    if (this.position + 1 < this.input.length){
                       char = this.input.charAt(this.position + 1); 
                    }
                    else {
                        char = '';
                    }
                }
                this.position += 1;
                return new Token(tokenType.proposition, prop);
            }
            else {
                this.position += 1;
                return new Token(tokenType.proposition, prop);
            }
        }

        if (char == ' ') {
            this.position += 1;
            return this.nextToken();
        }

        return "error";

    }
}


let test = new Lexer("(p && q)");
let tokens = test.tokenize();

console.log(tokens);