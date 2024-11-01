import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { Col, Container, Row } from "react-bootstrap";
function Square({ value, onSquareClick }) {
	return (
		<Button
			onClick={onSquareClick}
			style={{ width: 100, height: 100 }}
			variant='light'
			className='border border-primary fs-4'
		>
			{value}
		</Button>
	);
}

function Board({ xIsNext, squares, onPlay }) {
	function handleClick(i) {
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		const nextSquares = squares.slice();
		if (xIsNext) {
			nextSquares[i] = "X";
		} else {
			nextSquares[i] = "O";
		}
		onPlay(nextSquares);
	}

	const winner = calculateWinner(squares);
	let status;
	if (winner) {
		status = "Winner: " + winner;
	} else {
		status = "Next player: " + (xIsNext ? "X" : "O");
	}

	return (
		<>
			<div className='mb-2 fs-2 '>{status}</div>
			<Row>
				<Square value={squares[0]} onSquareClick={() => handleClick(0)} />
				<Square value={squares[1]} onSquareClick={() => handleClick(1)} />
				<Square value={squares[2]} onSquareClick={() => handleClick(2)} />
			</Row>
			<Row>
				<Square value={squares[3]} onSquareClick={() => handleClick(3)} />
				<Square value={squares[4]} onSquareClick={() => handleClick(4)} />
				<Square value={squares[5]} onSquareClick={() => handleClick(5)} />
			</Row>
			<Row>
				<Square value={squares[6]} onSquareClick={() => handleClick(6)} />
				<Square value={squares[7]} onSquareClick={() => handleClick(7)} />
				<Square value={squares[8]} onSquareClick={() => handleClick(8)} />
			</Row>
		</>
	);
}

export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)]);
	const [currentMove, setCurrentMove] = useState(0);
	const xIsNext = currentMove % 2 === 0;
	const currentSquares = history[currentMove];

	function handlePlay(nextSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
	}

	function jumpTo(nextMove) {
		setCurrentMove(nextMove);
	}

	const moves = history.map((squares, move) => {
		let description;
		if (move > 0) {
			description = "Go to move #" + move;
		} else {
			description = "Go to game start";
		}
		return (
			<li key={move}>
				<Button
					variant='primary'
					onClick={() => jumpTo(move)}
					className='w-25 m-1 d-block'
				>
					{description}
				</Button>
			</li>
		);
	});

	return (
		<Container>
			<Row>
				<Col className='d-flex justify-content-center'>
					<div>
						<Board
							xIsNext={xIsNext}
							squares={currentSquares}
							onPlay={handlePlay}
						/>
					</div>
				</Col>
				<Col className='pt-5'>
					<ol>{moves}</ol>
				</Col>
			</Row>
		</Container>
	);
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}
