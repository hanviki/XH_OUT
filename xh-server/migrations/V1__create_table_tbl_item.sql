CREATE TABLE `tbl_item` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '项目名称',
  `source` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT ' 项目来源',
  `fee` int(11) DEFAULT '0' COMMENT '项目经费',
  `start` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '起始年度',
  `end` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '终止年度',
  `rank` int(11) DEFAULT '0' COMMENT '排名',
  `score` int(11) DEFAULT '0' COMMENT '评分',
  `applicationId` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
