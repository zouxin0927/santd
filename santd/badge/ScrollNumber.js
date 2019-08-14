/**
 * @file 组件 ScrollNumber
 * @author chenkai13 <chenkai13@baidu.com>
 */

import './style/index.less';
import san, {DataTypes} from 'san';

export default san.defineComponent({
    dataTypes: {
        prefixCls: DataTypes.string,
        className: DataTypes.string,
        count: DataTypes.oneOfType([DataTypes.string, DataTypes.object, DataTypes.number]),
        title: DataTypes.oneOfType([DataTypes.string, DataTypes.object, DataTypes.number])
    },
    template: `
        <sup
            class="{{classes}}"
            title="{{title}}">
            <template s-if="isOverflow">
                {{count}}
            </template>
            <template s-else>
                <span
                    s-if="numberArray.length"
                    s-for="num, idx in numberArray"
                    class="{{prefixCls}}-only"
                    style="{{styleArr[idx]}};"
                >
                    <p s-for="item, p in renderNumberList" class="">{{item}}</p>
                </span>
            </template>
        </sup>
    `,
    computed: {
        classes() {
            const prefixCls = this.data.get('prefixCls');
            const className = this.data.get('className');
            return [prefixCls, className];
        },
        isOverflow() {
            let count = this.data.get('count');
            return !count || isNaN(count);
        },
        numberArray() {
            let num = this.data.get('count');
            return num !== undefined && num !== null ? num.toString().split('').map(i => Number(i)) : [];
        },
        lastNumArray() {
            return this.lastCount !== undefined ? this.lastCount.toString().split('').map(i => Number(i)) : [];
        },
        renderNumberList(pos) {
            let childrenToReturn = [];
            for (let i = 0; i < 30; i++) {
                childrenToReturn.push(i % 10);
            }
            return childrenToReturn;
        },
        posArray() {
            let numArr = this.data.get('numberArray');
            let resArr = [];
            for (let i in numArr) {
                let pos = numArr[i];
                const animateStarted = this.data.get('animateStarted');
                if (animateStarted) {
                    pos = 10 + numArr[i];
                }
                else {
                    const count = +this.data.get('count');
                    const currentDigit = numArr[i];
                    const lastDigit = this.data.get('lastNumArray')[i];
                    if (count > this.lastCount) {
                        if (currentDigit >= lastDigit) {
                            pos = 10 + numArr[i];
                        } else {
                            pos = 20 + numArr[i];
                        }
                    }
                    else if (currentDigit <= lastDigit) {
                        pos = 10 + numArr[i];
                    } else {
                        pos = numArr[i];
                    }
                }
                resArr.push(pos);
            }
            return resArr;
        }
    },
    getStyleArr() {
        let posArray = this.data.get('posArray');
        let styleArr = [];
        for (let i in posArray) {
            let pos = posArray[i];
            let style = `transform: translateY(${pos * -100}%);`;
            styleArr.push(style);
        }
        return styleArr;
    },
    initData() {
        return {
            count: null,
            showZero: false,
            dot: false,
            overflowCount: 99,
            animateStarted: true
        };
    },
    updateStyle() {
        if (!this.animated) {
            this.nextTick(() => {
                requestAnimationFrame(() => {
                    this.data.set('styleArr', this.getStyleArr());
                    this.nextTick(() => {
                        this.animated = true;
                    });
                });
                this.animated = false;
            });
        }
    },
    inited() {
        this.lastCount = this.data.get('count');
        this.data.set('styleArr', this.getStyleArr());
    },
    updated() {
        this.updateStyle();
        this.lastCount = this.data.get('count');
    }
});
