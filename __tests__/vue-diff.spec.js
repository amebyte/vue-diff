describe('Vue VNode Diff', () => {
  it('1. 左边查找', () => {
    const mountElement = jest.fn()
    const patch = jest.fn()
    const unmount = jest.fn()
    const move = jest.fn()
    const { vueDiff } = require('../vue-diff')
    vueDiff(
      [{ key: 'a' }, { key: 'b' }, { key: 'c' }],
      [{ key: 'a' }, { key: 'b' }, { key: 'd' }, { key: 'e' }],
      {
        mountElement,
        patch,
        unmount,
        move
      }
    )
    // 第一次调用次数
    expect(patch.mock.calls.length).toBe(2)
    // 第一次调用的第一个参数
    expect(patch.mock.calls[0][0]).toBe('a')
    expect(patch.mock.calls[1][0]).toBe('b')
  })

  it('2. 右边边查找', () => {
    const mountElement = jest.fn()
    const patch = jest.fn()
    const unmount = jest.fn()
    const move = jest.fn()
    const { vueDiff } = require('../vue-diff')
    vueDiff(
      [{ key: 'a' }, { key: 'b' }, { key: 'c' }],
      [{ key: 'd' }, { key: 'e' }, { key: 'b' }, { key: 'c' }],
      {
        mountElement,
        patch,
        unmount,
        move
      }
    )
    expect(patch.mock.calls.length).toBe(2)
    expect(patch.mock.calls[0][0]).toBe('c')
    expect(patch.mock.calls[1][0]).toBe('b')
  })

  it('3. 老节点没了，新节点还有', () => {
    const mountElement = jest.fn()
    const patch = jest.fn()
    const unmount = jest.fn()
    const move = jest.fn()
    const { vueDiff } = require('../vue-diff')
    vueDiff(
      [{ key: 'a' }, { key: 'b' }],
      [{ key: 'a' }, { key: 'b' }, { key: 'c' }],
      {
        mountElement,
        patch,
        unmount,
        move
      }
    )
    expect(patch.mock.calls.length).toBe(2)
    expect(patch.mock.calls[0][0]).toBe('a')
    expect(patch.mock.calls[1][0]).toBe('b')
    expect(mountElement.mock.calls[0][0]).toBe('c')
  })

  it("4. 老节点还有，新节点没了", () => {
    const mountElement = jest.fn();
    const patch = jest.fn();
    const unmount = jest.fn();
    const move = jest.fn();
    const { vueDiff } = require("../vue-diff");
    vueDiff(
      [{ key: "a" }, { key: "b" }, { key: "c" }],
      [{ key: "a" }, { key: "b" }],
      {
        mountElement,
        patch,
        unmount,
        move,
      }
    );
    // 第一次调用次数
    expect(patch.mock.calls.length).toBe(2);
    // 第一次调用的第一个参数
    expect(patch.mock.calls[0][0]).toBe("a");
    expect(patch.mock.calls[1][0]).toBe("b");
    expect(unmount.mock.calls[0][0]).toBe("c");
  });
})
