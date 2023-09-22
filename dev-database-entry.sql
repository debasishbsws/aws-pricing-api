USE aws_pricing;


CREATE TABLE IF NOT EXISTS `region` (
  `region_code` VARCHAR(255) PRIMARY KEY,
  `region_name` VARCHAR(255)
);

INSERT INTO `region` (`region_code`, `region_name`)
  VALUES ("us-east-1", "US East (N. Virginia)");

--  both region and service_code are primary key
CREATE TABLE IF NOT EXISTS `region_service` (
  `service_code` VARCHAR(255),
  `region_code` VARCHAR(255),
  PRIMARY KEY (service_code, region_code)
);

CREATE TABLE IF NOT EXISTS `pricing_terms` (
  `sku` VARCHAR(255),
  `offer_term_code` VARCHAR(255),
  `unit` VARCHAR(255),
  `price_per_unit` DECIMAL(12, 10),
  `description` TEXT,
  PRIMARY KEY (`sku`, `offer_term_code`)
);


-- INSERT INTO `region` (`region_code`, `region_name`)
--   VALUES ("us-east-1", "US East (N. Virginia)");

-- INSERT INTO `region` (`region_code`, `region_name`)
--   VALUES ('us-gov-west-1', 'AWS GovCloud (US)');

-- INSERT INTO `region` (`region_code`, `region_name`)
--   VALUES ('ap-south-1', 'Asia Pacific (Mumbai)');

-- INSERT INTO `region` (`region_code`, `region_name`)
--   VALUES ('ap-northeast-3', 'Asia Pacific (Osaka-Local)');

-- INSERT INTO `region` (`region_code`, `region_name`)
--   VALUES ('ap-northeast-2', 'Asia Pacific (Seoul)');




