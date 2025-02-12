import { customRef } from "vue";

export default function useMsgRef(msg: string, delay: number) {
  let timer: number;
  let msg2Value = msg;
  let msg2 = customRef((track, trigger) => {
    return {
      //被读取时调用
      get() {
        track(); //进行数据跟踪
        return msg2Value;
      },
      //被修改时调用
      set(value) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          msg2Value = value;
          trigger(); //触发更新
        }, delay);
      },
    };
  });
  return msg2;
}
