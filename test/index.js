const Container = require('../src/index').Container;

const container = new Container()

test('it should add a parameter', async () => {
    container.set('dummy_secret_key', 'something')

    let value = await container.get('dummy_secret_key')
    expect(value == 'something')
})