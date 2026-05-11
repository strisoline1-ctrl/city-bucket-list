import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { transition } from '../src/state/stateMachine.js';
import { STATES } from '../src/config/constants.js';

function makeSession(state, data = {}) {
  return {
    callSid: 'CA123',
    callerPhone: '+15550001111',
    state,
    attempts: 0,
    data: {
      name: null, intent: null, pickup: null, dropoff: null,
      scheduledAt: null, isImmediate: false, faqQuery: null,
      bookingId: null, driverId: null,
      ...data,
    },
  };
}

describe('State Machine', () => {
  it('GREETING → COLLECT_NAME on any input', () => {
    const result = transition(makeSession(STATES.GREETING), '');
    assert.equal(result.nextState, STATES.COLLECT_NAME);
  });

  it('COLLECT_NAME → COLLECT_INTENT when name provided', () => {
    const result = transition(makeSession(STATES.COLLECT_NAME), 'John Smith');
    assert.equal(result.nextState, STATES.COLLECT_INTENT);
    assert.equal(result.sessionPatch.name, 'john smith');
  });

  it('COLLECT_NAME reprompts on empty input', () => {
    const result = transition(makeSession(STATES.COLLECT_NAME), '');
    assert.equal(result.nextState, STATES.COLLECT_NAME);
    assert.equal(result.isReprompt, true);
  });

  it('COLLECT_INTENT → COLLECT_PICKUP for ride now', () => {
    const result = transition(makeSession(STATES.COLLECT_INTENT, { name: 'John' }), 'I need a ride now');
    assert.equal(result.nextState, STATES.COLLECT_PICKUP);
    assert.equal(result.sessionPatch.intent, 'ride_now');
    assert.equal(result.sessionPatch.isImmediate, true);
  });

  it('COLLECT_INTENT → COLLECT_PICKUP for booking', () => {
    const result = transition(makeSession(STATES.COLLECT_INTENT, { name: 'John' }), 'I want to book a ride');
    assert.equal(result.nextState, STATES.COLLECT_PICKUP);
    assert.equal(result.sessionPatch.intent, 'booking');
  });

  it('COLLECT_DROPOFF → CONFIRM for ride_now (skip time)', () => {
    const result = transition(
      makeSession(STATES.COLLECT_DROPOFF, { name: 'John', intent: 'ride_now', isImmediate: true, pickup: { raw: '123 Main St', zone: 'downtown' } }),
      'downtown library'
    );
    assert.equal(result.nextState, STATES.CONFIRM);
  });

  it('COLLECT_DROPOFF → COLLECT_TIME for booking', () => {
    const result = transition(
      makeSession(STATES.COLLECT_DROPOFF, { name: 'John', intent: 'booking', isImmediate: false, pickup: { raw: '123 Main St', zone: 'downtown' } }),
      'downtown library'
    );
    assert.equal(result.nextState, STATES.COLLECT_TIME);
  });

  it('CONFIRM yes → DISPATCH for ride_now', () => {
    const result = transition(
      makeSession(STATES.CONFIRM, { name: 'John', isImmediate: true, pickup: { raw: '123 Main', zone: 'downtown' }, dropoff: { raw: 'Library' } }),
      'yes that sounds good'
    );
    assert.equal(result.nextState, STATES.DISPATCH);
    assert.ok(result.sideEffects.some(e => e.type === 'dispatch_driver'));
    assert.ok(result.sideEffects.some(e => e.type === 'sms_owner'));
  });

  it('CONFIRM no → restart at COLLECT_PICKUP', () => {
    const result = transition(
      makeSession(STATES.CONFIRM, { name: 'John', isImmediate: true }),
      'no that is wrong'
    );
    assert.equal(result.nextState, STATES.COLLECT_PICKUP);
    assert.equal(result.sessionPatch.pickup, null);
  });

  it('escalates after MAX_REPROMPTS', () => {
    const session = { ...makeSession(STATES.COLLECT_NAME), attempts: 3 };
    const result = transition(session, '');
    assert.equal(result.nextState, STATES.ESCALATE);
  });
});
