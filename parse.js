class Parse {
    constructor(tokens) {
        this.tokenList = new Array();
        if (tokens.length != 0) {
            this.tokenList = tokens; // expect a array of tokens from the lexer
        }
        this.parsedObjects = {};
    }

    parse() {
        if (this.tokenList.length == 0) {
            return {};
        }

        let check = this.orderCheck();
        if (!check) {
            return {};
        }

        this.findPropositions();

        return this.parsedObjects;
    }

    orderCheck() {
        // checking to see whether the tokens are ordered in a valid way
        let parensChecker = [];
        let isPreviousProp = false;
        let isPreviousOperator = false;

        this.tokenList.forEach(token => {
            // check parens
            if (token.type === tokenType.startParentheses) { // checking for start parentheses
                parensChecker.push(token);
            }
            else if (token.type === tokenType.endParentheses) { // checking for end parentheses and whether it's placed correctly
                if (parensChecker.length == 0) {
                    return false;
                }
                parensChecker.pop();
            }
            // check propositions
            else if (token.type === tokenType.proposition && isPreviousProp) { // checking to make sure all propositions have logical operators in between them
                return false;
            }
            // check logical operators
            else if ((token.type === tokenType.and || token.type === tokenType.or || token.type === tokenType.conditional || token.type === tokenType.biconditional) && !isPreviousProp) {
                return false;
            }
            else if (isPreviousOperator && token.type !== tokenType.proposition) {
                return false;
            }

            // setting booleans to correct value
            if (token.type !== tokenType.proposition && isPreviousProp) { // reset isPreviousProp to false when token is not proposition
                isPreviousProp = false;
            }
            else if (token.type === tokenType.proposition && !isPreviousProp) { // marking the current token (which will become the previous token in the next loop) as true for isPreviousProp
                isPreviousProp = true;
            }

            if (token.type === tokenType.and || token.type === tokenType.or || token.type === tokenType.not || token.type === tokenType.conditional || token.type === tokenType.biconditional) { // marks previous operator as true if there is an and, or, not
                isPreviousOperator = true;
            }
            else if (isPreviousOperator) { // if isPreviousOperator is set to true, then set to false
                isPreviousOperator = false;
            }
        });
        
        if (parensChecker.length != 0 || isPreviousOperator) {
            return false;
        }

        return true;
    }

    findPropositions() {
        // assuming parsedObjects is empty
        let numOfPropositions = 0;

        this.tokenList.forEach(t => {
            if (t.type == tokenType.proposition) {
                this.parsedObjects[t.value] = [];
                numOfPropositions++;
            }
        });

        let addTrue = true;
        let power = numOfPropositions - 1;
        let numPerGroup = Math.pow(2, power);
        let currentGroupTot = 0;
        for (let i = 0; i < numOfPropositions; i++) {
            for (let b = 0; b < Math.pow(2, numOfPropositions); b++) {
                currentGroupTot++;
                if (addTrue) {
                    this.parsedObjects[Object.keys(this.parsedObjects)[i]].push(true);
                }
                else {
                    this.parsedObjects[Object.keys(this.parsedObjects)[i]].push(false);
                }
                if (currentGroupTot == numPerGroup) {
                    currentGroupTot = 0;
                    addTrue = !addTrue;
                }
            }
            // making sure that all necessary variables are set to initial state
            addTrue = true;
            currentGroupTot = 0;
            // adjusting number of bools needed before switchin from true to false and vice versa
            power--;
            numPerGroup = Math.pow(2, power);
        }
    }
}