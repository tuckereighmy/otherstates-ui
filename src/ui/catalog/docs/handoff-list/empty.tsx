import { HandoffList } from '../../../components';

export default function HandoffListEmpty() {
  return <HandoffList label="Waiting on you" items={[]} empty="Nothing is waiting on you. Runs that need a decision show here." />;
}
