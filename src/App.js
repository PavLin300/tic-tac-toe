import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { Col, Container, Row } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
function Square({ value, onSquareClick, winSquare }) {
	const variant = winSquare ? "danger" : "light";
	return (
		<Button
			onClick={onSquareClick}
			style={{ width: 100, height: 100 }}
			variant={variant}
			className='border border-primary fs-4'
		>
			{value}
		</Button>
	);
}

function Board({ xIsNext, squares, onPlay, onReset }) {
	function handleClick(i) {
		if (calculateWinner(squares)[0] || squares[i]) {
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

	const [winner, winIndexes] = calculateWinner(squares);
	let status;
	let winnerIndexes = Array(3).fill(null);
	if (winner) {
		status = "Winner: " + winner;
		winnerIndexes = winIndexes;
	} else {
		status = "Next player: " + (xIsNext ? "X" : "O");
	}

	return (
		<>
			<div className='mb-2 pt-3 fs-2 d-flex justify-content-between'>
				{status}
				<Button variant='outline-primary' onClick={onReset}>
					<i
						className='bi bi-arrow-clockwise align-self-end'
						style={{ fontSize: "30px" }}
					></i>
				</Button>
			</div>

			<Row>
				{squares.map((square, i) => (
					<Col lg={4} key={i}>
						<Square
							value={squares[i]}
							onSquareClick={() => handleClick(i)}
							winSquare={winnerIndexes.includes(i)}
						/>
					</Col>
				))}
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

	function handleReset() {
		setHistory([Array(9).fill(null)]);
		setCurrentMove(0);
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
					<div style={{ width: "44%" }}>
						<Board
							xIsNext={xIsNext}
							squares={currentSquares}
							onPlay={handlePlay}
							onReset={handleReset}
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
			return [squares[a], [a, b, c]];
		}
	}
	return [null, null];
}
