export type Condition<T> = (data: T) => boolean;

class ConditionMatch<T> {
    private matched: boolean;
    private readonly conditionFn: Condition<T>
    private captures: T[] = [];

    constructor(hasMatched: boolean,
                condition: Condition<T>) {
        this.matched = hasMatched;
        this.conditionFn = condition;
    }

    runCondition(data: T): ConditionMatch<T> {
        const conditionMatches = this.conditionFn(data);
        if (!this.matched) {
            this.matched = conditionMatches;
        }
        if (conditionMatches) {
            this.captures.push(data);
        }
        // console.log('[yt] match', this.matched);
        // console.log('[yt] match data', data);
        return this;
    }

    hasMatched(): boolean {
        return this.matched;
    }

    getCaptures(): T[] {
        return this.captures;
    }

}

export class ConditionsMatcher<T> {
    private conditions: ConditionMatch<T>[];

    constructor(conditions: Condition<T>[]) {
        this.conditions = conditions.map(this.toConditionMatch);
    }

    matchesAll(data: T): boolean {
        return this.conditions
            .map(condition => condition.runCondition(data))
            .every(condition => !!condition.hasMatched())
    }

    getCapturesForCondition(conditionIndex: number): T[] {
        return this.conditions[conditionIndex].getCaptures();
    }

    private toConditionMatch(condition: Condition<T>): ConditionMatch<T> {
        return new ConditionMatch<T>(false, condition);
    }
}