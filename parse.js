class Parse {
    constructor(tokens) {
        this.tokenList = new Array();
        if (tokens.length != 0) {
            // expect a array of tokens from the lexer
            this.tokenList = tokens; 
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
                // checking for start parentheses
                parensChecker.push(token);
            }
            else if (token.type === tokenType.endParentheses) { 
                // checking for end parentheses and whether it's placed correctly
                if (parensChecker.length == 0) {
                    return false;
                }
                parensChecker.pop();
            }
            // check propositions
            else if (token.type === tokenType.proposition && isPreviousProp) {
                 // checking to make sure all propositions have logical operators in between them
                return false;
            }
            // check logical operators
            else if ((token.type === tokenType.and || token.type === tokenType.or || token.type === tokenType.conditional || token.type === tokenType.biconditional) && !isPreviousProp) {
                // checking to make sure logical and, or, conditional, and biconditional operators have a preposition before
                return false;
            }
            else if (isPreviousOperator && (token.type !== tokenType.proposition || token.type != tokenType.startParentheses)) {
                // checking to make sure operators have a proposition or start parentheses afterwards
                return false;
            }

            // setting booleans to correct value
            if (token.type !== tokenType.proposition && isPreviousProp) { 
                // reset isPreviousProp to false when token is not proposition
                isPreviousProp = false;
            }
            else if (token.type === tokenType.proposition && !isPreviousProp) { 
                // marking the current token (which will become the previous token in the next loop) as true for isPreviousProp
                isPreviousProp = true;
            }

            if (token.type === tokenType.and || token.type === tokenType.or || token.type === tokenType.not || token.type === tokenType.conditional || token.type === tokenType.biconditional) {
                 // marks previous operator as true if there is an and, or, not
                isPreviousOperator = true;
            }
            else if (isPreviousOperator) { 
                // if isPreviousOperator is set to true, then set to false
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

        // first finds the prepositions
        this.tokenList.forEach(t => {
            if (t.type == tokenType.proposition) {
                this.parsedObjects[t.value] = [];
                numOfPropositions++;
            }
        });

        // and then gives each preposition true and false values so that every combination of true false is created
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
                // used to alternate pushing true or false
                if (currentGroupTot == numPerGroup) {
                    currentGroupTot = 0;
                    addTrue = !addTrue;
                }
            }
            // making sure that all necessary variables are set to initial state
            addTrue = true;
            currentGroupTot = 0;
            // adjusting number of bools needed before switching from true to false and vice versa
            power--;
            numPerGroup = Math.pow(2, power);
        }
    }
}