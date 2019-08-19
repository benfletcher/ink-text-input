import React from 'react';
import {render, Box} from 'ink'
import TextInput from './index';

function Example() {
	const [input0, input0Set] = React.useState('');
	const [input1, input1Set] = React.useState('');
	const [focus, focusSet] = React.useState(0);
	const [focusPrior, focusPriorSet] = React.useState(false);

	const handleSubmit = (finalInput, {focusPrior}) => {
		focusPriorSet(focusPrior);
		if (focus === 0) {
			input0Set(finalInput);
		} else {
			input1Set(finalInput);
		}

		if (focusPrior && focus > 0) {
			focusSet(n => n - 1);
		} else {
			focusSet(n => n + 1);
		}
	}

	return (
		<>
			<Box minHeight={1}>
				focusPrior: {String(focusPrior)}
			</Box>
			<Box minHeight={1}>
				{
					focus === 0
					? <TextInput
							value={input0}
							onChange={input0Set}
							onSubmit={handleSubmit}
						/>
					: String(input0)
				}
			</Box>
			<Box minHeight={1}>
				{
					focus === 1
						? <TextInput
								value={input1}
								onChange={input1Set}
								onSubmit={handleSubmit}
							/>
						: String(input1)
				}
			</Box>
		</>
	);
}


render(<Example />, {debug: true});
