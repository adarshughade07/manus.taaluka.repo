CREATE TABLE `waitlistEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contact` varchar(320) NOT NULL,
	`contactType` enum('email','mobile') NOT NULL,
	`referralCode` varchar(16) NOT NULL,
	`referredBy` varchar(16),
	`successfulReferrals` int NOT NULL DEFAULT 0,
	`positionsGained` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `waitlistEntries_id` PRIMARY KEY(`id`),
	CONSTRAINT `waitlistEntries_contact_unique` UNIQUE(`contact`),
	CONSTRAINT `waitlistEntries_referralCode_unique` UNIQUE(`referralCode`)
);
