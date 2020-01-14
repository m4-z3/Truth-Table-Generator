// tokenType was created to prevent any spelling mistakes that could occurr during the coding process
const tokenType = {
    startParentheses: "startParentheses",
    endParentheses: "endParentheses",
    proposition: "proposition",
    not: "not",
    and: "and",
    or: "or",
    conditional: "conditional",
    biconditional: "biconditional",
    endOfInput: "endOfInput",
    error: "error"
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
        
        let token = this.nextToken();

        while (token.type !== tokenType.endOfInput && token.type !== tokenType.error) {
            tokens.push(token);
            token = this.nextToken();
        }

        if (token.type === tokenType.error) {
            return [];
        }

        return tokens;
    }

    nextToken() {
        if (this.position >= this.input.length) {
            return new Token(tokenType.endOfInput,'');
        }
        
        let char = this.input.charAt(this.position);
        let nextChar = '';
        if (this.position + 1 < this.input.length) {
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

        if (char == "-" && nextChar == ">") {
            this.position += 2;
            return new Token(tokenType.conditional, "->");
        }

        if (char == "<" && nextChar == "-") {
            if (this.position + 2 < this.input.length) {
                if (this.input[this.position + 2] == ">") {
                    this.position += 3;
                    return new Token(tokenType.biconditional, "<->");
                }
            }
        }

        if (char == ' ') {
            this.position += 1;
            return this.nextToken();
        }

        return new Token(tokenType.error, "error");

    }
}