const Container = require('../dist/index').Container;

const container = new Container()

test('it should add a parameter properly', async () => {
    container.set('dummy_secret_key', 'something')

    let value = await container.get('dummy_secret_key')
    expect(value == 'something')
})

test('it should add a service properly', async () => {
    container.set('dummy_service', async () => {
        return async () => {
            return 'something'
        }
    })

    let service = await container.get('dummy_service')
    expect(typeof service == 'function')
    expect(typeof service.then == 'function')
    expect(await service() == 'something')
})