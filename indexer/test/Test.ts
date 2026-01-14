import assert from "assert";
import { 
  TestHelpers,
  CTF_OwnershipHandoverCanceled
} from "generated";
const { MockDb, CTF } = TestHelpers;

describe("CTF contract OwnershipHandoverCanceled event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for CTF contract OwnershipHandoverCanceled event
  const event = CTF.OwnershipHandoverCanceled.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("CTF_OwnershipHandoverCanceled is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await CTF.OwnershipHandoverCanceled.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualCTFOwnershipHandoverCanceled = mockDbUpdated.entities.CTF_OwnershipHandoverCanceled.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedCTFOwnershipHandoverCanceled: CTF_OwnershipHandoverCanceled = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pendingOwner: event.params.pendingOwner,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualCTFOwnershipHandoverCanceled, expectedCTFOwnershipHandoverCanceled, "Actual CTFOwnershipHandoverCanceled should be the same as the expectedCTFOwnershipHandoverCanceled");
  });
});
